// Lithothèque glossary - bilingual (FR/EN) geology terms, no backend: all data ships in the build.
//
// "GEO <word>" convention (Thomas, 2026-11-06): when he sends "GEO <word>" (comma-separated = several
// words), add one entry per word to GLOSSARY_TERMS under the relevant category. Each entry needs:
// - id: stable kebab-case key; category: a key from GLOSSARY_CATEGORIES
// - fr / en: { term, definition, source } - definitions original text grounded in the linked sources
// - image: { url, file, credit, license, alt } - Wikimedia Commons image whose license was verified
//   on the file page (file = Commons File: page for attribution); keep licenses to CC/PD only.
// Definitions were checked against the linked geology and university sources on 2026-11-06; image licenses were
// verified via the Commons API the same day.

export const GLOSSARY_CATEGORIES = [
    { id: 'terrain', fr: 'Terrain', en: 'Field geology' },
    { id: 'roches', fr: 'Roches & sédiments', en: 'Rocks & sediments' },
    { id: 'mineraux', fr: 'Minéraux', en: 'Minerals' },
    { id: 'structures', fr: 'Structures', en: 'Structures' },
    { id: 'relief', fr: 'Relief & processus', en: 'Landforms & processes' },
    { id: 'temps', fr: 'Temps & fossiles', en: 'Time & fossils' },
    { id: 'methodes', fr: 'Méthodes & métiers', en: 'Methods & professions' },
    { id: 'planete', fr: 'Planète Terre', en: 'Planet Earth' },
];

export const GLOSSARY_TERMS = [
    {
        "id": "affleurement",
        "category": "terrain",
        "fr": {
            "term": "Affleurement",
            "definition": "Partie d'une roche du sous-sol qui paraît à la surface, non masquée par le sol ou la végétation. C'est le point de départ de toute observation géologique sur le terrain.",
            "source": "https://fr.wikipedia.org/wiki/Affleurement"
        },
        "en": {
            "term": "Outcrop",
            "definition": "Bedrock or ancient deposits visible at the surface, not hidden under soil or vegetation. Outcrops are where field geology begins.",
            "source": "https://en.wikipedia.org/wiki/Outcrop"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Rockeskyller_Kopf_3.JPG/960px-Rockeskyller_Kopf_3.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Rockeskyller_Kopf_3.JPG",
            "credit": "Beckstet",
            "license": "CC BY-SA 3.0",
            "alt": "Carrière montrant des couches rocheuses qui affleurent"
        }
    },
    {
        "id": "pendage",
        "category": "terrain",
        "fr": {
            "term": "Pendage",
            "definition": "Angle d'inclinaison d'un plan géologique (couche, faille) par rapport à l'horizontale. Mesuré avec la direction du plan, il décrit l'orientation d'une structure.",
            "source": "https://fr.wikipedia.org/wiki/Pendage"
        },
        "en": {
            "term": "Dip (and strike)",
            "definition": "The angle at which a geological plane (bed, fault) tilts from horizontal. Together with the strike, it describes the orientation of a planar feature.",
            "source": "https://en.wikipedia.org/wiki/Strike_and_dip"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Strike_and_dip_on_bedding.svg/960px-Strike_and_dip_on_bedding.svg.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Strike_and_dip_on_bedding.svg",
            "credit": "CrunchyRocks, after Karla Panchuck",
            "license": "CC BY 4.0",
            "alt": "Schéma de la mesure du pendage sur une couche inclinée"
        }
    },
    {
        "id": "carte-geologique",
        "category": "terrain",
        "fr": {
            "term": "Carte géologique",
            "definition": "Carte qui représente la nature, l'âge et la répartition des roches et des structures (failles, plis) d'une région, au moyen de couleurs et de symboles.",
            "source": "https://fr.wikipedia.org/wiki/Carte_g%C3%A9ologique"
        },
        "en": {
            "term": "Geological map",
            "definition": "A map showing the type, age and distribution of rock units and structures (faults, folds) in a region, using colours and symbols.",
            "source": "https://en.wikipedia.org/wiki/Geological_map"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/World_geologic_provinces.jpg/960px-World_geologic_provinces.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:World_geologic_provinces.jpg",
            "credit": "USGS",
            "license": "Public domain",
            "alt": "Carte mondiale des provinces géologiques"
        }
    },
    {
        "id": "gisement",
        "category": "terrain",
        "fr": {
            "term": "Gisement",
            "definition": "Concentration naturelle d'une ressource dans le sol ou le sous-sol. Pour un minerai, on parle de gisement minéral ou métallifère ; pour le pétrole ou le gaz, de gisement pétrolier ou gazier. Un gisement peut être caché en profondeur.",
            "source": "https://fr.wikipedia.org/wiki/Gisement"
        },
        "en": {
            "term": "Deposit / field",
            "definition": "A natural concentration of a resource in the ground. The translation depends on the resource: mineral or ore deposit, but oilfield or gas field for hydrocarbons. A deposit may be hidden underground.",
            "source": "https://en.wikipedia.org/wiki/Ore"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Mina_de_Chuquicamata%2C_Calama%2C_Chile%2C_2016-02-01%2C_DD_110-112_PAN.JPG/960px-Mina_de_Chuquicamata%2C_Calama%2C_Chile%2C_2016-02-01%2C_DD_110-112_PAN.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Mina_de_Chuquicamata,_Calama,_Chile,_2016-02-01,_DD_110-112_PAN.JPG",
            "credit": "Diego Delso",
            "license": "CC BY-SA 4.0",
            "alt": "Mine de cuivre à ciel ouvert de Chuquicamata, Chili"
        }
    },
    {
        "id": "granite",
        "category": "roches",
        "fr": {
            "term": "Granite",
            "definition": "Roche magmatique plutonique à grains visibles, riche en quartz et feldspaths, formée par refroidissement lent d'un magma siliceux en profondeur.",
            "source": "https://fr.wikipedia.org/wiki/Granite"
        },
        "en": {
            "term": "Granite",
            "definition": "A coarse-grained intrusive igneous rock rich in quartz and feldspars, formed when silica-rich magma cools slowly underground.",
            "source": "https://en.wikipedia.org/wiki/Granite"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Bianco_Sardo_Granit_mit_polierter_Oberfl%C3%A4che.jpg/960px-Bianco_Sardo_Granit_mit_polierter_Oberfl%C3%A4che.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Bianco_Sardo_Granit_mit_polierter_Oberfl%C3%A4che.jpg",
            "credit": "The stone gate",
            "license": "CC BY-SA 4.0",
            "alt": "Surface polie de granite montrant quartz et feldspaths"
        }
    },
    {
        "id": "basalte",
        "category": "roches",
        "fr": {
            "term": "Basalte",
            "definition": "Roche volcanique sombre à grains fins, issue du refroidissement rapide d'une lave fluide riche en fer et magnésium. Elle forme l'essentiel des fonds océaniques.",
            "source": "https://fr.wikipedia.org/wiki/Basalte"
        },
        "en": {
            "term": "Basalt",
            "definition": "A dark, fine-grained volcanic rock from fast-cooling, iron- and magnesium-rich lava. It makes up most of the ocean floor.",
            "source": "https://en.wikipedia.org/wiki/Basalt"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Basalt_12_%2848674276333%29.jpg/960px-Basalt_12_%2848674276333%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Basalt_12_(48674276333).jpg",
            "credit": "James St. John",
            "license": "CC BY 2.0",
            "alt": "Échantillon de basalte"
        }
    },
    {
        "id": "gneiss",
        "category": "roches",
        "fr": {
            "term": "Gneiss",
            "definition": "Roche métamorphique feuilletée à gros grains (quartz, feldspaths, micas), formée sous haute température et pression à partir de roches sédimentaires ou magmatiques.",
            "source": "https://fr.wikipedia.org/wiki/Gneiss"
        },
        "en": {
            "term": "Gneiss",
            "definition": "A foliated metamorphic rock with visible grains of quartz, feldspar and mica, formed under high temperature and pressure from sedimentary or igneous rocks.",
            "source": "https://en.wikipedia.org/wiki/Gneiss"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/6/60/Gneiss.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:Gneiss.jpg",
            "credit": "Siim Sepp",
            "license": "CC BY-SA 3.0",
            "alt": "Échantillon de gneiss rubané"
        }
    },
    {
        "id": "schiste",
        "category": "roches",
        "fr": {
            "term": "Schiste",
            "definition": "Roche à aspect feuilleté qui se débite en plaques fines : on dit qu'elle a une schistosité. Le mot couvre le schiste métamorphique et, au sens large, les roches sédimentaires argileuses, que les géologues appellent plutôt argilite ou « shale ».",
            "source": "https://fr.wikipedia.org/wiki/Schiste"
        },
        "en": {
            "term": "Schist",
            "definition": "A metamorphic rock with pronounced schistosity: it splits into thin sheets or flakes. In French, \"schiste\" is also used loosely for clayey sedimentary rocks, which geologists call shale or argillite.",
            "source": "https://en.wikipedia.org/wiki/Schist"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Schist_detail.jpg/960px-Schist_detail.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Schist_detail.jpg",
            "credit": "Michael C. Rygel",
            "license": "CC BY-SA 3.0",
            "alt": "Détail de schiste, roche métamorphique feuilletée"
        }
    },
    {
        "id": "gres",
        "category": "roches",
        "fr": {
            "term": "Grès",
            "definition": "Roche sédimentaire détritique majoritairement sableuse : des grains de 0,063 à 2 mm, issus de l'érosion de roches préexistantes, consolidés par un ciment lors de la diagenèse.",
            "source": "https://fr.wikipedia.org/wiki/Gr%C3%A8s_(g%C3%A9ologie)"
        },
        "en": {
            "term": "Sandstone",
            "definition": "A clastic sedimentary rock made of sand-sized grains (0.0625-2 mm) cemented together during burial. Sandstones are about a fifth of all sedimentary rocks.",
            "source": "https://en.wikipedia.org/wiki/Sandstone"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/a/af/USDA_Mineral_Sandstone_93c3955.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:USDA_Mineral_Sandstone_93c3955.jpg",
            "credit": "USDA",
            "license": "Public domain",
            "alt": "Tranche sciée de grès"
        }
    },
    {
        "id": "argile",
        "category": "roches",
        "fr": {
            "term": "Argile",
            "definition": "Matière rocheuse naturelle très fine, issue de l'altération de silicates comme les feldspaths, à base de minéraux hydratés en feuillets. Plastique quand elle est humide, elle durcit à la cuisson.",
            "source": "https://fr.wikipedia.org/wiki/Argile"
        },
        "en": {
            "term": "Clay",
            "definition": "A fine-grained natural material from the weathering of silicates such as feldspars, built of hydrated sheet-silicate (clay) minerals. Plastic when wet, it hardens when fired.",
            "source": "https://en.wikipedia.org/wiki/Clay"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Mettingen_Querenberg_Clay_Pit_02.jpg/960px-Mettingen_Querenberg_Clay_Pit_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Mettingen_Querenberg_Clay_Pit_02.jpg",
            "credit": "J.-H. Janßen",
            "license": "CC BY-SA 3.0",
            "alt": "Carrière d’argile de Querenberg, Mettingen"
        }
    },
    {
        "id": "quartz",
        "category": "mineraux",
        "fr": {
            "term": "Quartz",
            "definition": "Minéral de silice (SiO₂) dur (7 sur l'échelle de Mohs) et sans clivage. Avec environ 12 % de la masse de la lithosphère, c'est l'un des minéraux les plus abondants.",
            "source": "https://fr.wikipedia.org/wiki/Quartz"
        },
        "en": {
            "term": "Quartz",
            "definition": "A hard silica mineral (SiO₂), 7 on the Mohs scale, with no cleavage; about 12% of the lithosphere by mass, one of the most common minerals on Earth.",
            "source": "https://en.wikipedia.org/wiki/Quartz"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Quartz_Br%C3%A9sil.jpg/960px-Quartz_Br%C3%A9sil.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Quartz_Br%C3%A9sil.jpg",
            "credit": "Didier Descouens",
            "license": "CC BY-SA 4.0",
            "alt": "Cristaux de quartz, Minas Gerais, Brésil"
        }
    },
    {
        "id": "calcite",
        "category": "mineraux",
        "fr": {
            "term": "Calcite",
            "definition": "Carbonate de calcium (CaCO₃), minéral principal du calcaire et du marbre. Tendre (3 Mohs), il effervesce à l'acide et dédouble les images par biréfringence.",
            "source": "https://fr.wikipedia.org/wiki/Calcite"
        },
        "en": {
            "term": "Calcite",
            "definition": "Calcium carbonate (CaCO₃), the main mineral of limestone and marble. Soft (3 Mohs), it fizzes with acid and shows strong double refraction.",
            "source": "https://en.wikipedia.org/wiki/Calcite"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Calcite_Variation.png/960px-Calcite_Variation.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Calcite_Variation.png",
            "credit": "PaleoNeolitic",
            "license": "CC BY 4.0",
            "alt": "Variétés de formes cristallines de la calcite"
        }
    },
    {
        "id": "grenat",
        "category": "mineraux",
        "fr": {
            "term": "Grenat",
            "definition": "Famille de minéraux silicatés cristallisant dans le système cubique, souvent présents dans les roches métamorphiques. Leurs cristaux peuvent avoir douze faces ; certaines variétés servent de gemmes ou d'abrasifs.",
            "source": "https://fr.wikipedia.org/wiki/Grenat"
        },
        "en": {
            "term": "Garnet",
            "definition": "A group of silicate minerals in the cubic crystal system, often found in metamorphic rocks. Their crystals can have twelve faces; some varieties are used as gemstones or abrasives.",
            "source": "https://en.wikipedia.org/wiki/Garnet"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Garnet_Andradite20.jpg/960px-Garnet_Andradite20.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Garnet_Andradite20.jpg",
            "credit": "Moha112100",
            "license": "CC BY-SA 3.0",
            "alt": "Cristal de grenat andradite"
        }
    },
    {
        "id": "faille",
        "category": "structures",
        "fr": {
            "term": "Faille",
            "definition": "Plan ou zone de rupture le long duquel deux blocs rocheux se sont déplacés l'un par rapport à l'autre, sous l'effet des contraintes tectoniques.",
            "source": "https://fr.wikipedia.org/wiki/Faille"
        },
        "en": {
            "term": "Fault",
            "definition": "A fracture between two rock blocks that have slipped past each other under tectonic stress. The largest faults mark plate boundaries.",
            "source": "https://en.wikipedia.org/wiki/Fault_(geology)"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/4/48/Piqiang_Fault%2C_China_detail.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:Piqiang_Fault,_China_detail.jpg",
            "credit": "NASA Earth Observatory / Robert Simmon",
            "license": "Public domain",
            "alt": "Vue satellite de la faille de Piqiang, Chine"
        }
    },
    {
        "id": "pli",
        "category": "structures",
        "fr": {
            "term": "Pli",
            "definition": "Déformation courbe de couches rocheuses initialement planes, plissées sans se rompre (déformation ductile) sous l'effet des contraintes tectoniques.",
            "source": "https://fr.wikipedia.org/wiki/Pli_(g%C3%A9ologie)"
        },
        "en": {
            "term": "Fold",
            "definition": "A bend in originally flat rock layers, deformed without breaking (ductile deformation) under tectonic stress. Folds range from microscopic crinkles to mountain-sized arcs.",
            "source": "https://en.wikipedia.org/wiki/Fold_(geology)"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Folding_of_alternate_layers_of_limestone_layers_with_chert_layers.jpg/960px-Folding_of_alternate_layers_of_limestone_layers_with_chert_layers.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Folding_of_alternate_layers_of_limestone_layers_with_chert_layers.jpg",
            "credit": "Dieter Mueller",
            "license": "CC BY-SA 4.0",
            "alt": "Couches de calcaire et de chert plissées"
        }
    },
    {
        "id": "discordance",
        "category": "structures",
        "fr": {
            "term": "Discordance",
            "definition": "Ancienne surface d'érosion ou de non-dépôt séparant deux séries de couches d'âges différents : la série inférieure a été érodée avant le dépôt de la série supérieure. Elle marque un hiatus dans l'enregistrement sédimentaire.",
            "source": "https://fr.wikipedia.org/wiki/Discordance_(stratigraphie)"
        },
        "en": {
            "term": "Unconformity",
            "definition": "A buried surface of erosion or non-deposition separating rock sequences of different ages: the older layers were eroded before the younger were laid down. It marks a gap (hiatus) in the record.",
            "source": "https://en.wikipedia.org/wiki/Unconformity"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Hutton_Unconformity%2C_Jedburgh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:Hutton_Unconformity,_Jedburgh.jpg",
            "credit": "Dave souza",
            "license": "Public domain",
            "alt": "Discordance de Hutton à Jedburgh, Écosse"
        }
    },
    {
        "id": "moraine",
        "category": "relief",
        "fr": {
            "term": "Moraine",
            "definition": "Accumulation de débris rocheux transportés ou déposés par un glacier. On distingue notamment les moraines latérales sur ses bords, médianes au centre et frontales à son extrémité.",
            "source": "https://fr.wikipedia.org/wiki/Moraine"
        },
        "en": {
            "term": "Moraine",
            "definition": "An accumulation of rock debris carried or deposited by a glacier. Lateral moraines lie along its sides, medial moraines down its centre, and terminal moraines at its end.",
            "source": "https://en.wikipedia.org/wiki/Moraine"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Manang_site_%2854%29.JPG/960px-Manang_site_%2854%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Manang_site_(54).JPG",
            "credit": "Bijaya2043",
            "license": "CC BY-SA 3.0",
            "alt": "Moraine dans la région de Manang, Népal"
        }
    },
    {
        "id": "cirque",
        "category": "relief",
        "fr": {
            "term": "Cirque glaciaire",
            "definition": "Dépression en forme d'amphithéâtre, entourée de parois raides, à l'amont d'une vallée glaciaire. Elle est façonnée par l'érosion glaciaire et peut rester visible après la disparition du glacier.",
            "source": "https://fr.wikipedia.org/wiki/Cirque_glaciaire"
        },
        "en": {
            "term": "Cirque",
            "definition": "An amphitheatre-shaped hollow with steep walls at the head of a glacial valley. It is shaped by glacial erosion and may remain after the glacier has disappeared.",
            "source": "https://en.wikipedia.org/wiki/Cirque"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Gavarnie-Cirque.JPG/960px-Gavarnie-Cirque.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Gavarnie-Cirque.JPG",
            "credit": "Jean-Christophe Benoist",
            "license": "CC BY 3.0",
            "alt": "Cirque de Gavarnie, Hautes-Pyrénées"
        }
    },
    {
        "id": "erosion",
        "category": "relief",
        "fr": {
            "term": "Érosion",
            "definition": "Processus de dégradation et de transformation du relief (sols, roches, berges, littoraux) par des agents externes - eau, glace, vent, gravité - qui retirent les matériaux d'un lieu pour les déposer ailleurs.",
            "source": "https://fr.wikipedia.org/wiki/%C3%89rosion"
        },
        "en": {
            "term": "Erosion",
            "definition": "The wearing away and reshaping of the land by external agents (water, ice, wind, gravity), removing soil and rock from one place and depositing them elsewhere.",
            "source": "https://en.wikipedia.org/wiki/Erosion"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Eroding_rill_in_field_in_eastern_Germany.jpg/960px-Eroding_rill_in_field_in_eastern_Germany.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Eroding_rill_in_field_in_eastern_Germany.jpg",
            "credit": "Katharina Helming",
            "license": "CC BY-SA 1.0",
            "alt": "Rigole d'érosion dans un champ, Allemagne de l'Est"
        }
    },
    {
        "id": "ravinement",
        "category": "relief",
        "fr": {
            "term": "Ravinement",
            "definition": "Érosion soudaine d'un sol meuble par un ruissellement concentré, lors de fortes averses, qui creuse des ravines : de petites vallées à parois abruptes progressant vers l'amont.",
            "source": "https://fr.wikipedia.org/wiki/Ravinement"
        },
        "en": {
            "term": "Gully erosion",
            "definition": "Sudden erosion of soft ground by concentrated runoff during heavy rain, cutting gullies: steep-walled channels that grow by headward (upstream) erosion.",
            "source": "https://en.wikipedia.org/wiki/Gully_erosion"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Vo%C3%A7oroca_%2823_12_24S_-_48_47_59W%29_-_REFON_3.JPG/960px-Vo%C3%A7oroca_%2823_12_24S_-_48_47_59W%29_-_REFON_3.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Vo%C3%A7oroca_(23_12_24S_-_48_47_59W)_-_REFON_3.JPG",
            "credit": "Jose Reynaldo da Fonseca",
            "license": "CC BY 2.5",
            "alt": "Ravine (voçoroca) à Avaré, Brésil"
        }
    },
    {
        "id": "fossile",
        "category": "temps",
        "fr": {
            "term": "Fossile",
            "definition": "Reste, empreinte ou trace d'activité d'un organisme ayant vécu dans le passé géologique. Les fossiles sont souvent conservés dans les roches sédimentaires, mais ne sont pas tous minéralisés.",
            "source": "https://fr.wikipedia.org/wiki/Fossile"
        },
        "en": {
            "term": "Fossil",
            "definition": "A preserved remain, impression or trace of activity of an organism from the geological past. Fossils are often found in sedimentary rocks, but are not all mineralized.",
            "source": "https://en.wikipedia.org/wiki/Fossil"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Whale_2261-2263mod.jpg/960px-Whale_2261-2263mod.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Whale_2261-2263mod.jpg",
            "credit": "JYB Devot",
            "license": "CC BY-SA 4.0",
            "alt": "Squelette de baleine fossile (Miocène), désert d'Ica, Pérou"
        }
    },
    {
        "id": "datation-radiometrique",
        "category": "temps",
        "fr": {
            "term": "Datation radiométrique",
            "definition": "Méthode qui estime un âge à partir de la désintégration radioactive d'isotopes, dont la vitesse est connue. Selon la méthode, elle compare l'isotope restant à ses produits de désintégration ou à une référence.",
            "source": "https://fr.wikipedia.org/wiki/Datation_radiom%C3%A9trique"
        },
        "en": {
            "term": "Radiometric dating",
            "definition": "A method that estimates age using radioactive decay of isotopes at known rates. Depending on the method, it compares the remaining isotope with its decay products or a reference.",
            "source": "https://en.wikipedia.org/wiki/Radiometric_dating"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Thorium_decay_chain_from_lead-212_to_lead-208.svg/960px-Thorium_decay_chain_from_lead-212_to_lead-208.svg.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Thorium_decay_chain_from_lead-212_to_lead-208.svg",
            "credit": "Eugene Alvin Villar",
            "license": "CC BY-SA 4.0",
            "alt": "Chaîne de désintégration radioactive"
        }
    },
    {
        "id": "superposition",
        "category": "temps",
        "fr": {
            "term": "Principe de superposition",
            "definition": "Énoncé par Nicolas Sténon (1669) : dans une série de couches non renversée, une couche est plus récente que celle qu'elle recouvre et plus ancienne que celle qui la surmonte. Base de la datation relative.",
            "source": "https://fr.wikipedia.org/wiki/Principe_de_superposition_(g%C3%A9ologie)"
        },
        "en": {
            "term": "Law of superposition",
            "definition": "Stated by Nicolas Steno (1669): in an undisturbed sequence, each layer is younger than the one beneath it and older than the one above. A foundation of relative dating.",
            "source": "https://en.wikipedia.org/wiki/Law_of_superposition"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/IsfjordenSuperposition.jpg/960px-IsfjordenSuperposition.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:IsfjordenSuperposition.jpg",
            "credit": "Wilson44691",
            "license": "Public domain",
            "alt": "Couches sédimentaires superposées, Isfjorden, Svalbard"
        }
    },
    {
        "id": "lithosphere",
        "category": "planete",
        "fr": {
            "term": "Lithosphère",
            "definition": "Enveloppe rigide à la surface de la Terre : elle réunit la croûte et la partie supérieure du manteau. Fragmentée en plaques tectoniques, elle repose sur l'asthénosphère, plus ductile.",
            "source": "https://fr.wikipedia.org/wiki/Lithosph%C3%A8re"
        },
        "en": {
            "term": "Lithosphere",
            "definition": "The rigid outermost rocky shell of a planet. On Earth it combines the crust and the uppermost mantle, and is broken into tectonic plates riding over the softer, ductile asthenosphere.",
            "source": "https://en.wikipedia.org/wiki/Lithosphere"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Lithosphere_of_Earth_-_Idealized_Cross-section.jpg/960px-Lithosphere_of_Earth_-_Idealized_Cross-section.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Lithosphere_of_Earth_-_Idealized_Cross-section.jpg",
            "credit": "Peter A. Cawood et al.",
            "license": "CC BY 4.0",
            "alt": "Coupe idéalisée de la lithosphère terrestre"
        }
    },
    {
        "id": "andesite",
        "category": "roches",
        "fr": {
            "term": "Andésite",
            "definition": "Roche volcanique à composition intermédiaire entre basalte et rhyolite, à grains fins ou à grands cristaux dans une pâte fine. Elle est fréquente dans les arcs volcaniques de subduction.",
            "source": "https://fr.wikipedia.org/wiki/And%C3%A9site"
        },
        "en": {
            "term": "Andesite",
            "definition": "A volcanic rock intermediate in composition between basalt and rhyolite, with fine grains or larger crystals in a fine groundmass. It is common in subduction-related volcanic arcs.",
            "source": "https://en.wikipedia.org/wiki/Andesite"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Amygdaloidal_andesite.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
            "file": "https://commons.wikimedia.org/wiki/File:Amygdaloidal_andesite.jpg",
            "credit": "Photographer: Siim Sepp, 2005",
            "license": "CC BY-SA 3.0",
            "alt": "Andésite - Dark groundmass is andesite. Amygdaloidal structure, vesicules are filled with zeolite. Diameter is 8 cm. Rock sample belongs to the University of Tartu."
        }
    },
    {
        "id": "rhyolite",
        "category": "roches",
        "fr": {
            "term": "Rhyolite",
            "definition": "Roche volcanique riche en silice, équivalent volcanique du granite. Elle est généralement vitreuse ou à grains fins, parfois avec de grands cristaux de quartz et de feldspath.",
            "source": "https://fr.wikipedia.org/wiki/Rhyolite"
        },
        "en": {
            "term": "Rhyolite",
            "definition": "A silica-rich volcanic rock, the extrusive equivalent of granite. It is generally glassy or fine-grained, sometimes with larger quartz and feldspar crystals.",
            "source": "https://en.wikipedia.org/wiki/Rhyolite"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Loebejuener_porphyr_poliert.jpg/960px-Loebejuener_porphyr_poliert.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Loebejuener_porphyr_poliert.jpg",
            "credit": "Benhoff",
            "license": "CC BY-SA 3.0",
            "alt": "Rhyolite - Polished section of sample of permocarboniferous (“Rotliegend”, Gzhelian-Asselian) rhyolite, so-called Löbejüner Porphyr (“Löbejün Porphyry”), Halle Volcanic Co"
        }
    },
    {
        "id": "diorite",
        "category": "roches",
        "fr": {
            "term": "Diorite",
            "definition": "Roche magmatique plutonique à grains visibles, formée par refroidissement lent en profondeur. Sa composition est intermédiaire entre le gabbro et le granite ; son équivalent volcanique est l'andésite.",
            "source": "https://fr.wikipedia.org/wiki/Diorite"
        },
        "en": {
            "term": "Diorite",
            "definition": "A coarse-grained intrusive igneous rock formed by slow cooling underground. Its composition is intermediate between gabbro and granite; its volcanic equivalent is andesite.",
            "source": "https://en.wikipedia.org/wiki/Diorite"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Diorite2.tif/lossy-page1-960px-Diorite2.tif.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Diorite2.tif",
            "credit": "Michael C. Rygel",
            "license": "CC BY-SA 3.0",
            "alt": "Diorite - Hand sample of diorite"
        }
    },
    {
        "id": "gabbro",
        "category": "roches",
        "fr": {
            "term": "Gabbro",
            "definition": "Roche plutonique sombre à grains visibles, riche en plagioclase et pyroxène. Elle refroidit lentement en profondeur et correspond au basalte par sa composition.",
            "source": "https://fr.wikipedia.org/wiki/Gabbro"
        },
        "en": {
            "term": "Gabbro",
            "definition": "A dark, coarse-grained intrusive rock rich in plagioclase and pyroxene. It cools slowly underground and has a composition corresponding to basalt.",
            "source": "https://en.wikipedia.org/wiki/Gabbro"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Gabbro_pmg_ss_2006.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
            "file": "https://commons.wikimedia.org/wiki/File:Gabbro_pmg_ss_2006.jpg",
            "credit": "Siim Sepp",
            "license": "CC BY-SA 3.0",
            "alt": "Gabbro en lame mince observé en lumière polarisée croisée"
        }
    },
    {
        "id": "gypse",
        "category": "mineraux",
        "fr": {
            "term": "Gypse",
            "definition": "Minéral tendre de sulfate de calcium hydraté (CaSO₄ · 2H₂O), de dureté 2 sur l'échelle de Mohs. Le même nom désigne une roche évaporitique formée principalement de ce minéral, utilisé pour fabriquer le plâtre.",
            "source": "https://fr.wikipedia.org/wiki/Gypse"
        },
        "en": {
            "term": "Gypsum",
            "definition": "A soft hydrated calcium sulfate mineral (CaSO₄ · 2H₂O), hardness 2 on the Mohs scale. The name also refers to an evaporite rock consisting mainly of this mineral, which is used to make plaster.",
            "source": "https://en.wikipedia.org/wiki/Gypsum"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Soufre%26gypse_sicile.jpg/960px-Soufre%26gypse_sicile.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Soufre%26gypse_sicile.jpg",
            "credit": "Didier Descouens",
            "license": "CC BY-SA 4.0",
            "alt": "Cristaux de gypse accompagnés de soufre, Sicile"
        }
    },
    {
        "id": "marne",
        "category": "roches",
        "fr": {
            "term": "Marne",
            "definition": "Roche sédimentaire faite d'un mélange de minéraux argileux et de carbonate de calcium, dans des proportions voisines. Sa sensibilité à l'eau favorise le ravinement et les instabilités de pente.",
            "source": "https://fr.wikipedia.org/wiki/Marne_(g%C3%A9ologie)"
        },
        "en": {
            "term": "Marl / marlstone",
            "definition": "A sedimentary mixture of clay minerals and calcium carbonate in roughly comparable proportions. In English, the hardened rock is called marlstone; marl can also refer to unconsolidated material.",
            "source": "https://en.wikipedia.org/wiki/Marl"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Piece_of_marl.JPG/960px-Piece_of_marl.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Piece_of_marl.JPG",
            "credit": "Tashkoskim",
            "license": "CC BY-SA 4.0",
            "alt": "Marne - Piece of marl"
        }
    },
    {
        "id": "micaschiste",
        "category": "roches",
        "fr": {
            "term": "Micaschiste",
            "definition": "Roche métamorphique riche en mica, souvent accompagnée de quartz et de feldspaths. L'orientation de ses minéraux en feuillets lui donne une foliation marquée.",
            "source": "https://fr.wikipedia.org/wiki/Micaschiste"
        },
        "en": {
            "term": "Mica schist",
            "definition": "A metamorphic rock rich in mica, often with quartz and feldspar. The alignment of its platy minerals gives it a pronounced foliation.",
            "source": "https://en.wikipedia.org/wiki/Schist"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Micaschiste_grenat.jpg/960px-Micaschiste_grenat.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Micaschiste_grenat.jpg",
            "credit": "NicolasGrandjean",
            "license": "CC BY-SA 3.0",
            "alt": "Micaschiste - Inclusions de grenats dans du micaschiste. île de Groix, pointe des chats, Morbihan."
        }
    },
    {
        "id": "amphibolite",
        "category": "roches",
        "fr": {
            "term": "Amphibolite",
            "definition": "Roche métamorphique généralement sombre, composée surtout d'amphibole et de plagioclase. Elle provient souvent du métamorphisme d'une roche magmatique comme le basalte.",
            "source": "https://fr.wikipedia.org/wiki/Amphibolite"
        },
        "en": {
            "term": "Amphibolite",
            "definition": "A typically dark metamorphic rock composed mainly of amphibole and plagioclase. It commonly forms by metamorphism of an igneous rock such as basalt.",
            "source": "https://en.wikipedia.org/wiki/Amphibolite"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Amphibolit.jpg/960px-Amphibolit.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Amphibolit.jpg",
            "credit": "Bernabè Egon",
            "license": "Public domain",
            "alt": "Amphibolite - Amphibolite from Val di Fleres, Italy"
        }
    },
    {
        "id": "quartzite",
        "category": "roches",
        "fr": {
            "term": "Quartzite",
            "definition": "Roche très dure constituée surtout de grains de quartz soudés. Le quartzite métamorphique se forme par recristallisation d'un grès riche en quartz sous l'effet de la chaleur et de la pression.",
            "source": "https://fr.wikipedia.org/wiki/Quartzite"
        },
        "en": {
            "term": "Quartzite",
            "definition": "A very hard rock made mainly of interlocking quartz grains. Metamorphic quartzite forms when quartz-rich sandstone recrystallizes under heat and pressure.",
            "source": "https://en.wikipedia.org/wiki/Quartzite"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Sample_of_Quartzite.JPG/960px-Sample_of_Quartzite.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Sample_of_Quartzite.JPG",
            "credit": "Manishwiki15",
            "license": "CC BY-SA 3.0",
            "alt": "Quartzite - Quartzite has a grainy, sandpaper-like surface which becomes glassy in appearance"
        }
    },
    {
        "id": "mineral",
        "category": "mineraux",
        "fr": {
            "term": "Minéral",
            "definition": "Substance solide naturelle, formée par un processus géologique, caractérisée en général par une composition chimique définie et une structure cristalline. Une roche peut être constituée d'un ou de plusieurs minéraux.",
            "source": "https://fr.wikipedia.org/wiki/Min%C3%A9ral"
        },
        "en": {
            "term": "Mineral",
            "definition": "A naturally occurring solid formed by geological processes, generally characterized by a defined chemical composition and crystal structure. A rock may consist of one mineral or a mixture of several.",
            "source": "https://en.wikipedia.org/wiki/Mineral"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Quartz_Br%C3%A9sil.jpg/960px-Quartz_Br%C3%A9sil.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Quartz_Br%C3%A9sil.jpg",
            "credit": "Didier Descouens",
            "license": "CC BY-SA 4.0",
            "alt": "Cristaux de quartz, un exemple de minéral"
        }
    },
    {
        "id": "cristal",
        "category": "mineraux",
        "fr": {
            "term": "Cristal",
            "definition": "Solide dont les atomes, ions ou molécules présentent un arrangement microscopique ordonné, généralement périodique. Les faces géométriques visibles de certains cristaux reflètent cet ordre interne ; un cristal peut être naturel ou fabriqué.",
            "source": "https://fr.wikipedia.org/wiki/Cristal"
        },
        "en": {
            "term": "Crystal",
            "definition": "A solid whose atoms, ions or molecules have an ordered microscopic arrangement, usually periodic. The geometric faces of some crystals reflect this internal order; crystals may be natural or manufactured.",
            "source": "https://en.wikipedia.org/wiki/Crystal"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Quartz_28.jpg/960px-Quartz_28.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Quartz_28.jpg",
            "credit": "Géry PARENT",
            "license": "Public domain",
            "alt": "Cristal de quartz aux faces géométriques"
        }
    },
    {
        "id": "obsidienne",
        "category": "roches",
        "fr": {
            "term": "Obsidienne",
            "definition": "Roche volcanique vitreuse, généralement riche en silice, formée lorsque la lave se solidifie avec très peu de croissance cristalline. Amorphe et cassante, elle se fracture en éclats aux bords très tranchants.",
            "source": "https://fr.wikipedia.org/wiki/Obsidienne"
        },
        "en": {
            "term": "Obsidian",
            "definition": "A volcanic glass, usually rich in silica, formed when lava solidifies with very little crystal growth. Amorphous and brittle, it breaks into fragments with very sharp edges.",
            "source": "https://en.wikipedia.org/wiki/Obsidian"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Rainbow_obsidian.jpg/960px-Rainbow_obsidian.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Rainbow_obsidian.jpg",
            "credit": "Brocken Inaglory",
            "license": "CC BY-SA 3.0",
            "alt": "Obsidienne à reflets colorés"
        }
    },
    {
        "id": "petrographie",
        "category": "methodes",
        "fr": {
            "term": "Pétrographie",
            "definition": "Description et classification des roches d'après leur composition minérale, leur texture et leur structure. Elle associe l'observation sur le terrain et des échantillons à l'étude microscopique, notamment en lame mince.",
            "source": "https://fr.wikipedia.org/wiki/P%C3%A9trographie"
        },
        "en": {
            "term": "Petrography",
            "definition": "The description and classification of rocks by their mineral composition, texture and structure. It combines field and hand-specimen observations with microscopic study, especially of thin sections.",
            "source": "https://en.wikipedia.org/wiki/Petrography"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/LvMS-Lvm.jpg/960px-LvMS-Lvm.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:LvMS-Lvm.jpg",
            "credit": "Matt Affolter (QFL247)",
            "license": "CC BY-SA 3.0",
            "alt": "Grain de sable volcanique en lumière polarisée et en lumière polarisée analysée"
        }
    },
    {
        "id": "litholamelleurs",
        "category": "methodes",
        "fr": {
            "term": "Litholamelleurs",
            "definition": "Pluriel de litholamelleur, aussi appelé lithopréparateur : technicien qui prépare des lames minces de roches pour leur étude au microscope. Il découpe, amincit et polit les échantillons en contrôlant l'épaisseur et la qualité des préparations.",
            "source": "https://factuel.univ-lorraine.fr/article/a-la-decouverte-du-metier-de-lithopreparateur/"
        },
        "en": {
            "term": "Thin section technicians",
            "definition": "Technicians who prepare thin sections of rocks for microscopic study. They cut, grind and polish samples while checking the thickness and quality of the preparations. French singular: litholamelleur; plural: litholamelleurs.",
            "source": "https://le.ac.uk/people/annika-burns"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Thin_sections.JPG/960px-Thin_sections.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Thin_sections.JPG",
            "credit": "Woudloper",
            "license": "CC BY-SA 1.0",
            "alt": "Lames minces de calcaire sur la platine d'un microscope, illustration du travail de préparation"
        }
    },
    {
        "id": "peridotite",
        "category": "roches",
        "fr": {
            "term": "Péridotite",
            "definition": "Roche ultramafique à gros cristaux, riche en olivine et contenant généralement des pyroxènes. Elle constitue l'essentiel du manteau supérieur terrestre ; on la rencontre aussi en fragments remontés par des magmas ou dans des massifs exposés en surface.",
            "source": "https://fr.wikipedia.org/wiki/P%C3%A9ridotite"
        },
        "en": {
            "term": "Peridotite",
            "definition": "A coarse-grained ultramafic rock rich in olivine and usually containing pyroxenes. It makes up most of Earth's upper mantle and also occurs as fragments brought up by magmas or in rock masses exposed at the surface.",
            "source": "https://en.wikipedia.org/wiki/Peridotite"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/3/36/Perid_SanCarlos.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:Perid_SanCarlos.jpg",
            "credit": "No machine-readable author provided. Omphacite~commonswiki assumed (based on copyright claims).",
            "license": "Public domain",
            "alt": "Péridotite de San Carlos, Arizona"
        }
    },
    {
        "id": "feldspath",
        "category": "mineraux",
        "fr": {
            "term": "Feldspath",
            "definition": "Minéral d'un groupe d'aluminosilicates très abondants dans la croûte terrestre. Les feldspaths comprennent notamment les feldspaths alcalins et les plagioclases ; ils sont présents dans de nombreuses roches magmatiques, métamorphiques et sédimentaires.",
            "source": "https://fr.wikipedia.org/wiki/Feldspath"
        },
        "en": {
            "term": "Feldspar",
            "definition": "A mineral of a group of aluminium silicates that are very abundant in Earth's crust. Feldspars include alkali feldspars and plagioclases and occur in many igneous, metamorphic and sedimentary rocks.",
            "source": "https://en.wikipedia.org/wiki/Feldspar"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/3/34/PlagioclaseFeldsparUSGOV.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:PlagioclaseFeldsparUSGOV.jpg",
            "credit": "USGS",
            "license": "Public domain",
            "alt": "Feldspath plagioclase, exemple du groupe des feldspaths"
        }
    },
    {
        "id": "micas",
        "category": "mineraux",
        "fr": {
            "term": "Micas",
            "definition": "Famille de minéraux silicatés en feuillets qui se séparent facilement en fines lamelles souples et élastiques. Les micas, dont la muscovite et la biotite, sont fréquents dans les granites et les schistes.",
            "source": "https://fr.wikipedia.org/wiki/Mica"
        },
        "en": {
            "term": "Micas",
            "definition": "A family of sheet silicate minerals that split easily into thin, flexible, elastic plates. Micas, including muscovite and biotite, are common in granites and schists.",
            "source": "https://en.wikipedia.org/wiki/Mica"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/5/50/MicaSheetUSGOV.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:MicaSheetUSGOV.jpg",
            "credit": "USGS",
            "license": "Public domain",
            "alt": "Feuillets de mica avec une pièce comme échelle"
        }
    },
    {
        "id": "silice",
        "category": "mineraux",
        "fr": {
            "term": "Silice",
            "definition": "Dioxyde de silicium (SiO₂), composé présent dans la nature sous des formes cristallines, comme le quartz, ou amorphes. La silice désigne une composition chimique : elle ne se confond ni avec le seul quartz ni avec l'ensemble des silicates.",
            "source": "https://fr.wikipedia.org/wiki/Silice"
        },
        "en": {
            "term": "Silica",
            "definition": "Silicon dioxide (SiO₂), a compound found in nature in crystalline forms such as quartz and in amorphous forms. Silica names a chemical composition: it is not synonymous with quartz alone or with the whole silicate group.",
            "source": "https://en.wikipedia.org/wiki/Silicon_dioxide"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Quartz_Br%C3%A9sil.jpg/960px-Quartz_Br%C3%A9sil.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:Quartz_Br%C3%A9sil.jpg",
            "credit": "Didier Descouens",
            "license": "CC BY-SA 4.0",
            "alt": "Quartz, exemple de silice cristalline - not all silica is quartz"
        }
    },
    {
        "id": "vacuole",
        "category": "structures",
        "fr": {
            "term": "Vacuole",
            "definition": "Petite cavité dans une roche, laissée par une bulle de gaz lors de la solidification d'une lave ou par la dissolution d'un constituant. Dans une roche volcanique, une cavité issue d'une bulle se traduit par vesicle en anglais ; le sens général est cavity.",
            "source": "https://www.cnrtl.fr/definition/vacuole"
        },
        "en": {
            "term": "Cavity / vesicle",
            "definition": "A small cavity in a rock, produced by a trapped gas bubble during lava solidification or by dissolution of a constituent. Vesicle is the specific English term for a gas-bubble cavity in volcanic rock; cavity is the broader translation of French vacuole.",
            "source": "https://sites.wustl.edu/meteoritesite/items/vesicles-in-meteorites/"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/4/49/Olivine_basalt2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:Olivine_basalt2.jpg",
            "credit": "No machine-readable author provided. Siim assumed (based on copyright claims).",
            "license": "CC BY-SA 3.0",
            "alt": "Basalte à olivine avec des vacuoles, La Palma"
        }
    },
    {
        "id": "lapilli",
        "category": "roches",
        "fr": {
            "term": "Lapilli",
            "definition": "Fragments projetés lors d'une éruption volcanique, généralement classés entre 2 et 64 mm : plus gros que les cendres, plus petits que les bombes et blocs. Le terme décrit une taille, pas une composition ; il peut inclure des fragments de roche, de lave ou des agrégats de cendres.",
            "source": "https://fr.wikipedia.org/wiki/Lapilli"
        },
        "en": {
            "term": "Lapilli",
            "definition": "Fragments ejected during a volcanic eruption, generally classified as 2-64 mm across: larger than ash and smaller than bombs and blocks. The term describes size, not composition, and can include rock or lava fragments and aggregates of ash.",
            "source": "https://en.wikipedia.org/wiki/Lapilli"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/6/67/PuuPuaiLapilli_large.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
            "file": "https://commons.wikimedia.org/wiki/File:PuuPuaiLapilli_large.jpg",
            "credit": "USGS",
            "license": "Public domain",
            "alt": "Lapilli du Kīlauea"
        }
    },
    {
        "id": "socle-hercynien",
        "category": "structures",
        "fr": {
            "term": "Socle hercynien",
            "definition": "Ensemble de roches anciennes, métamorphiques et granitiques, plissées puis pénéplanées lors de l'orogenèse hercynienne (varisque), du Dévonien au Permien. En France, il affleure dans les massifs anciens (Armoricain, Central, Vosges, Maures) et s'enfonce ailleurs sous la couverture sédimentaire.",
            "source": "https://fr.wikipedia.org/wiki/Socle_(g%C3%A9ologie)"
        },
        "en": {
            "term": "Hercynian basement",
            "definition": "The ancient crystalline basement of metamorphic and granitic rocks, folded and peneplained during the Hercynian (Variscan) orogeny, from the Devonian to the Permian. In France it crops out in the old massifs (Armorican, Central, Vosges, Maures) and lies elsewhere beneath the sedimentary cover.",
            "source": "https://en.wikipedia.org/wiki/Basement_(geology)"
        },
        "image": {
            "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/French_Hercynian_massifs_EN.svg/960px-French_Hercynian_massifs_EN.svg.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
            "file": "https://commons.wikimedia.org/wiki/File:French_Hercynian_massifs_EN.svg",
            "credit": "Woudloper",
            "license": "Public domain",
            "alt": "Carte des massifs hercyniens français"
        }
    },
    {
        "id": "alluvion",
        "category": "roches",
        "fr": {
            "term": "Alluvion",
            "definition": "Dépôt sédimentaire meuble (argile, limon, sable, gravier, galets) laissé par les eaux d'un cours d'eau dans son lit, sa plaine d'inondation, un delta ou une plage. Généralement récentes, les alluvions ne sont pas consolidées en roche.",
            "source": "https://fr.wikipedia.org/wiki/Alluvion"
        },
        "en": {
            "term": "Alluvium",
            "definition": "Loose, unconsolidated sediment (clay, silt, sand or gravel) deposited by running water in a stream bed, on a floodplain, in a delta or on a beach. Typically geologically young, alluvium is not consolidated into solid rock.",
            "source": "https://en.wikipedia.org/wiki/Alluvium"
        },
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/7/71/Soil_profile_in_river_alluvium%2C_Gt_Ouse_floodplain_SE_of_Bedford_-_geograph.org.uk_-_225985.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
            "file": "https://commons.wikimedia.org/wiki/File:Soil_profile_in_river_alluvium,_Gt_Ouse_floodplain_SE_of_Bedford_-_geograph.org.uk_-_225985.jpg",
            "credit": "Rodney Burton / geograph.org.uk",
            "license": "CC BY-SA 2.0",
            "alt": "Profil de sol dans des alluvions fluviales, avec une pelle pour l'échelle"
        }
    },
    {
            "id": "chlorite",
            "category": "mineraux",
            "fr": {
                    "term": "Chlorite",
                    "definition": "Groupe d'une quinzaine de phyllosilicates de fer, de magnésium et d'aluminium, de formule générale (Fe,Mg,Al)₆(Si,Al)₄O₁₀(OH)₈. Tendres (2 à 2,5 sur l'échelle de Mohs), en feuillets flexibles proches du mica, les chlorites sont typiques des roches métamorphiques de faible degré comme les schistes verts. Leur nom vient du grec khlôros, « vert » : elles ne contiennent pas de chlore.",
                    "source": "https://fr.wikipedia.org/wiki/Groupe_des_chlorites"
            },
            "en": {
                    "term": "Chlorite (group)",
                    "definition": "A group of about fifteen phyllosilicate minerals of iron, magnesium and aluminium, with general formula (Fe,Mg,Al)₆(Si,Al)₄O₁₀(OH)₈. Soft (Mohs 2-2.5), with flexible mica-like flakes, chlorites are typical of low-grade metamorphic rocks such as greenschist and of altered igneous rocks. Their name comes from the Greek chloros, 'green': they contain no chlorine.",
                    "source": "https://en.wikipedia.org/wiki/Chlorite_group"
            },
            "image": {
                    "url": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Clinochlore-usa12c.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
                    "file": "https://commons.wikimedia.org/wiki/File:Clinochlore-usa12c.jpg",
                    "credit": "Rob Lavinsky, iRocks.com",
                    "license": "CC BY-SA 3.0",
                    "alt": "Cristal de clinochlore, un minéral vert foncé du groupe des chlorites (mine Tilly Foster, New York)"
            }
    },
    {
            "id": "kaolin",
            "category": "roches",
            "fr": {
                    "term": "Kaolin",
                    "definition": "Argile blanche, friable et réfractaire, composée principalement de kaolinite, un silicate d'aluminium issu de l'altération des feldspaths des roches granitiques. Matière première de la porcelaine depuis la Chine, il tient son nom du chinois gaoling, « collines hautes », près de Jingdezhen ; il sert aussi au papier, aux cosmétiques et à la médecine.",
                    "source": "https://fr.wikipedia.org/wiki/Kaolin"
            },
            "en": {
                    "term": "Kaolin (china clay)",
                    "definition": "A white, friable, refractory clay made up mainly of the mineral kaolinite, produced by the weathering of feldspar in granitic rocks. Kaolin names the rock; kaolinite the dominant mineral. The raw material of porcelain, named after Gaoling, 'high hills', near Jingdezhen in China, it is also used in paper, cosmetics and medicine.",
                    "source": "https://en.wikipedia.org/wiki/Kaolinite"
            },
            "image": {
                    "url": "https://upload.wikimedia.org/wikipedia/commons/6/61/Kaolin.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
                    "file": "https://commons.wikimedia.org/wiki/File:Kaolin.jpg",
                    "credit": "USGS",
                    "license": "Public domain",
                    "alt": "Morceau de kaolin blanc, avec une pièce de monnaie pour l'échelle"
            }
    },
    {
            "id": "montmorillonite",
            "category": "mineraux",
            "fr": {
                    "term": "Montmorillonite",
                    "definition": "Minéral argileux du groupe des smectites, un phyllosilicate 2:1 de formule (Na,Ca)₀,₃(Al,Mg)₂Si₄O₁₀(OH)₂·nH₂O. De l'eau et des cations échangeables s'insèrent entre ses feuillets microscopiques, qui gonflent fortement au contact de l'eau : c'est un constituant typique des sols gonflants. Nommée d'après Montmorillon (Vienne), elle est aussi appelée terre de Sommières.",
                    "source": "https://fr.wikipedia.org/wiki/Montmorillonite"
            },
            "en": {
                    "term": "Montmorillonite",
                    "definition": "A very soft clay mineral of the smectite group: a 2:1 phyllosilicate whose microscopic plates are separated by water and exchangeable cations, so it swells strongly when wet and is a classic component of swelling soils. It is named after Montmorillon in France.",
                    "source": "https://en.wikipedia.org/wiki/Montmorillonite"
            },
            "image": {
                    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Montmorillonite_%28GeoDIL_number_-_2341%29.jpg/960px-Montmorillonite_%28GeoDIL_number_-_2341%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
                    "file": "https://commons.wikimedia.org/wiki/File:Montmorillonite_(GeoDIL_number_-_2341).jpg",
                    "credit": "Shannon Heinle (GeoDIL)",
                    "license": "Public domain (CC0 1.0)",
                    "alt": "Échantillon de montmorillonite, une argile beige clair"
            }
    },
    {
            "id": "diagenese",
            "category": "roches",
            "fr": {
                    "term": "Diagenèse",
                    "definition": "Ensemble des transformations physiques, chimiques et biologiques qu'un sédiment subit après son dépôt, pendant son enfouissement : la compaction tasse les grains, puis la cimentation et la recristallisation les soudent, jusqu'à former une roche sédimentaire.",
                    "source": "https://fr.wikipedia.org/wiki/Diagen%C3%A8se"
            },
            "en": {
                    "term": "Diagenesis",
                    "definition": "All the physical, chemical and biological changes a sediment undergoes after deposition, as burial turns it into sedimentary rock: compaction squeezes the grains together, while cementation and recrystallization bind them into solid rock.",
                    "source": "https://en.wikipedia.org/wiki/Diagenesis"
            },
            "image": {
                    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Sediment_Compaction_and_Diagenesis.jpg/960px-Sediment_Compaction_and_Diagenesis.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
                    "file": "https://commons.wikimedia.org/wiki/File:Sediment_Compaction_and_Diagenesis.jpg",
                    "credit": "Page Quinton",
                    "license": "CC BY-SA 4.0",
                    "alt": "Schéma des changements à l'échelle du grain dans un grès pendant la compaction et la cimentation"
            }
    },
    {
            "id": "corail",
            "category": "temps",
            "fr": {
                    "term": "Corail",
                    "definition": "Animal marin de l'embranchement des cnidaires, vivant le plus souvent en colonies de polypes qui partagent un squelette calcaire. Par l'accumulation de ces squelettes, les coraux durs bâtisseurs de récifs ont formé les récifs coralliens, plus grandes structures complexes créées par des organismes vivants.",
                    "source": "https://fr.wikipedia.org/wiki/Corail"
            },
            "en": {
                    "term": "Coral",
                    "definition": "A marine invertebrate of the phylum Cnidaria, usually living in colonies of tiny polyps that share a hard skeleton. Reef-building corals secrete calcium carbonate, and the accumulation of their skeletons forms coral reefs, the largest complex structures built by living organisms.",
                    "source": "https://en.wikipedia.org/wiki/Coral"
            },
            "image": {
                    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Coral_%28Galaxea_fascicularis%29%2C_mar_Rojo%2C_Egipto%2C_2023-04-18%2C_DD_128.jpg/960px-Coral_%28Galaxea_fascicularis%29%2C_mar_Rojo%2C_Egipto%2C_2023-04-18%2C_DD_128.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
                    "file": "https://commons.wikimedia.org/wiki/File:Coral_(Galaxea_fascicularis),_mar_Rojo,_Egipto,_2023-04-18,_DD_128.jpg",
                    "credit": "Diego Delso",
                    "license": "CC BY-SA 4.0",
                    "alt": "Colonie de corail Galaxea fascicularis aux polypes ouverts, mer Rouge"
            }
    },
    {
            "id": "phytoplancton",
            "category": "planete",
            "fr": {
                    "term": "Phytoplancton",
                    "definition": "Partie du plancton qui tire son énergie de la photosynthèse : cyanobactéries, diatomées, dinoflagellés et coccolithophoridés dérivent dans la zone éclairée des océans. Base des chaînes alimentaires marines, il produit environ la moitié de l'oxygène de la planète ; les plaques calcaires des coccolithophoridés fossiles ont formé la craie.",
                    "source": "https://fr.wikipedia.org/wiki/Phytoplancton"
            },
            "en": {
                    "term": "Phytoplankton",
                    "definition": "The photosynthesizing part of plankton: cyanobacteria, diatoms, dinoflagellates and coccolithophores drifting in the sunlit surface layer of oceans and lakes. The base of marine food webs, it produces about half of Earth's oxygen; the calcium-carbonate plates of fossil coccolithophores built up chalk.",
                    "source": "https://en.wikipedia.org/wiki/Phytoplankton"
            },
            "image": {
                    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Diatoms_through_the_microscope.jpg/960px-Diatoms_through_the_microscope.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
                    "file": "https://commons.wikimedia.org/wiki/File:Diatoms_through_the_microscope.jpg",
                    "credit": "Prof. Gordon T. Taylor, Stony Brook University",
                    "license": "Public domain",
                    "alt": "Diatomées, un groupe majeur du phytoplancton, observées au microscope optique"
            }
    }
];
