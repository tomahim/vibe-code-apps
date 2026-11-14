"""Minimal stdlib-only FIT parsing for the Garmin import.

Value-level only: field numbers, raw FIT-epoch timestamps, no semantic
names or unit conversions. Undocumented message types are never decoded.
"""
import struct


def _fit_scan(data):
    """Return (file_type, session_start_epoch_s, sport) or (None, None, None)."""
    defs = {}

    def read_def(pos, local, data, dev_flag):
        arch = data[pos + 1]
        fmt = ">" if arch else "<"
        gmn = struct.unpack_from(fmt + "H", data, pos + 2)[0]
        nf = data[pos + 4]
        fields = []
        p = pos + 5
        for _ in range(nf):
            fields.append((data[p], data[p + 1]))
            p += 3
        dev_sizes = []
        if dev_flag:  # developer data definitions add (num, size, dev_idx)
            ndf = data[p]
            p += 1
            for _ in range(ndf):
                dev_sizes.append(data[p + 1])
                p += 3
        defs[local] = (gmn, fields, fmt, dev_sizes)
        return p

    ftype = start = sport = None
    try:
        pos = data[0]  # header size
        data_end = pos + struct.unpack_from("<I", data, 4)[0]
        while pos < data_end and (ftype is None or start is None):
            rh = data[pos]
            pos += 1
            if rh & 0x80:
                local = (rh >> 5) & 0x03
            elif rh & 0x40:
                pos = read_def(pos, rh & 0x0F, data, bool(rh & 0x20))
                continue
            else:
                local = rh & 0x0F
            if local not in defs:
                break
            gmn, fields, fmt, dev_sizes = defs[local]
            values = {}
            for num, size in fields:
                values[num] = (pos, size)
                pos += size
            pos += sum(dev_sizes)  # developer data fields trail every data message
            if gmn == 0 and 0 in values:  # file_id.type
                off, _ = values[0]
                ftype = data[off]
            if gmn == 18 and ftype == 4:  # session of an activity file
                for num, size in fields:
                    off, sz = values[num]
                    if num == 2 and sz == 4:  # start_time (FIT epoch 1989)
                        start = struct.unpack_from(fmt + "I", data, off)[0] + 631065600
                    if num == 5 and sz == 1:  # sport
                        sport = data[off]
    except (IndexError, struct.error):
        pass
    return ftype, start, sport


# FIT base types: number -> (struct char, size). String and byte handled apart.
# enum=0 sint8=1 uint8=2 sint16=3 uint16=4 sint32=5 uint32=6 string=7
# float32=8 float64=9 uint8z=10 uint16z=11 uint32z=12 byte=13
# sint64=14 uint64=15 uint64z=16
_BASE = {
    0: ("B", 1), 1: ("b", 1), 2: ("B", 1), 3: ("h", 2), 4: ("H", 2),
    5: ("i", 4), 6: ("I", 4), 8: ("f", 4), 9: ("d", 8), 10: ("B", 1),
    11: ("H", 2), 12: ("I", 4), 13: ("B", 1), 14: ("q", 8), 15: ("Q", 8),
    16: ("Q", 8),
}
# Known message types decoded into extra payload, keyed by field number.
_DECODED_GMN = {18: "sessions", 19: "laps", 21: "events", 12: "sport",
                23: "device_info", 34: "activity", 7: "zones_target", 78: "hrv"}
_RECORD_GMN = 20
_DEV_DEF_GMN = 206   # field_description
_DEV_ID_GMN = 207    # developer_data_id


def _decode_value(data, pos, size, btype, fmt):
    bt = btype & 0x1F
    if bt == 7:  # string
        return data[pos:pos + size].split(b"\x00")[0].decode("utf-8", "replace")
    if bt == 13:  # byte blob
        return data[pos:pos + size].hex()
    if bt in _BASE and size >= _BASE[bt][1]:
        ch, sz = _BASE[bt]
        vals = struct.unpack_from(fmt + ch * (size // sz), data, pos)
        return vals[0] if len(vals) == 1 else list(vals)
    return data[pos:pos + size].hex()


def _fit_decode(data, gmn_wanted, include_records=False):
    """Generic walk: decode wanted message types into {field_num: value} dicts.

    Values keep field numbers (no semantic names, no unit conversion) so
    nothing is guessed. Developer fields are decoded using the file's own
    field_description messages and keyed "dev:<index>:<field>" (with the
    declared name attached in dev_field_defs). FIT epoch fields stay raw
    ints (seconds since 1989-12-31 UTC). Per-second record messages are
    counted always and decoded only when include_records is set.
    """
    defs = {}
    dev_defs = {}  # (dev_data_index, field_def_num) -> {"name":, "btype":}
    out = {}
    record_count = 0
    try:
        pos = data[0]
        data_end = pos + struct.unpack_from("<I", data, 4)[0]
        while pos < data_end:
            rh = data[pos]
            pos += 1
            if rh & 0x80:
                local = (rh >> 5) & 3
            elif rh & 0x40:
                local = rh & 0x0F
                dev = bool(rh & 0x20)
                fmt = ">" if data[pos + 1] else "<"
                gmn = struct.unpack_from(fmt + "H", data, pos + 2)[0]
                nf = data[pos + 4]
                fields = []
                p2 = pos + 5
                for _ in range(nf):
                    fields.append((data[p2], data[p2 + 1], data[p2 + 2]))
                    p2 += 3
                dev_fields = []
                if dev:
                    ndf = data[p2]
                    p2 += 1
                    for _ in range(ndf):
                        # (field_def_num, size, dev_data_index)
                        dev_fields.append((data[p2], data[p2 + 1], data[p2 + 2]))
                        p2 += 3
                defs[local] = (gmn, fields, fmt, dev_fields)
                pos = p2
                continue
            else:
                local = rh & 15
            if local not in defs:
                break
            gmn, fields, fmt, dev_fields = defs[local]
            if gmn == _RECORD_GMN:
                record_count += 1
                if not include_records:
                    pos += sum(sz for _, sz, _ in fields) + sum(s for _, s, _ in dev_fields)
                    continue
            if gmn in gmn_wanted or (gmn == _RECORD_GMN and include_records) or gmn in (_DEV_DEF_GMN, _DEV_ID_GMN):
                rec = {}
                for num, size, btype in fields:
                    rec[num] = _decode_value(data, pos, size, btype, fmt)
                    pos += size
                for fnum, size, didx in dev_fields:
                    dd = dev_defs.get((didx, fnum), {})
                    rec["dev:%d:%d" % (didx, fnum)] = _decode_value(
                        data, pos, size, dd.get("btype", 13), fmt)
                    pos += size
                if gmn == _DEV_DEF_GMN:
                    key = (rec.get(0), rec.get(1))  # dev index, field num
                    dev_defs[key] = {"name": rec.get(3), "btype": rec.get(2)}
                    out.setdefault("dev_field_defs", []).append(rec)
                elif gmn == _DEV_ID_GMN:
                    out.setdefault("developer_data_ids", []).append(rec)
                elif gmn == _RECORD_GMN:
                    out.setdefault("records", []).append(rec)
                else:
                    out.setdefault(gmn_wanted[gmn], []).append(rec)
            else:
                pos += sum(sz for _, sz, _ in fields) + sum(s for _, s, _ in dev_fields)
    except (IndexError, struct.error):
        pass
    return out, record_count
