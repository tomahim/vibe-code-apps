"""Published Little Grains content and learner history (no publishing/review engine)."""

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Q

from apps.learning.mixins import IllustrationMixin


class ContentEntity(models.Model):
    class Kind(models.TextChoices):
        THEME = "theme", "Theme"
        LEARNING_PATH = "learning_path", "Learning path"
        LESSON = "lesson", "Lesson"
        CARD = "card", "Card"
        QUESTION = "question", "Question"

    # Supplied by GitHub metadata, not generated on import.
    id = models.UUIDField(primary_key=True, editable=False)
    kind = models.CharField(max_length=20, choices=Kind.choices)
    # Retain an explicit tombstone rather than treating missing content as deleted.
    archived = models.BooleanField(default=False)

    class Meta:
        db_table = "lg_content_entity"
        constraints = [models.CheckConstraint(condition=Q(kind__in=[
            "theme", "learning_path", "lesson", "card", "question",
        ]), name="lg_entity_valid_kind")]

    def clean(self):
        super().clean()
        original = type(self).objects.filter(pk=self.pk).values_list("kind", flat=True).first()
        if original is not None and original != self.kind:
            raise ValidationError({"kind": "A content UUID cannot change kind."})


class ContentRecord(models.Model):
    entity = models.OneToOneField(
        ContentEntity, primary_key=True, db_column="id", on_delete=models.PROTECT,
        related_name="%(class)s",
    )
    position = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    published = models.BooleanField(default=False)
    CONTENT_KIND = None

    class Meta:
        abstract = True
        ordering = ["position", "pk"]
        constraints = [models.CheckConstraint(
            condition=Q(position__gte=1), name="lg_%(class)s_positive_position",
        )]

    @property
    def id(self):
        """The GitHub UUID, also available as pk/entity_id; no second content ID."""
        return self.pk

    def clean(self):
        super().clean()
        if not self.entity_id:
            return
        entity = ContentEntity.objects.filter(pk=self.entity_id).first()
        if entity is not None:
            errors = {}
            if entity.kind != self.CONTENT_KIND:
                errors["entity"] = "Content UUID is registered for a different kind."
            if self.published and entity.archived:
                errors["published"] = "Archived content cannot be published."
            if errors:
                raise ValidationError(errors)


class ProvenancedContent(ContentRecord):
    content_hash = models.CharField(max_length=64, blank=True)
    source_path = models.CharField(max_length=1024)
    last_changed_commit = models.CharField(max_length=64)

    class Meta(ContentRecord.Meta):
        abstract = True


class DescribedContent(ProvenancedContent):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image_path = models.CharField(max_length=1024, blank=True)
    image_alt = models.TextField(blank=True)

    class Meta(ProvenancedContent.Meta):
        abstract = True

    def clean(self):
        super().clean()
        if self.image_path and not self.image_alt.strip():
            raise ValidationError({"image_alt": "Images require useful alt text."})


class Theme(DescribedContent):
    CONTENT_KIND = ContentEntity.Kind.THEME
    introduction_markdown = models.TextField(blank=True)

    class Meta(DescribedContent.Meta):
        db_table = "lg_theme"
        constraints = DescribedContent.Meta.constraints + [
            models.UniqueConstraint(fields=["position"], name="lg_theme_unique_position"),
        ]


class LearningPath(DescribedContent):
    CONTENT_KIND = ContentEntity.Kind.LEARNING_PATH
    theme = models.ForeignKey(Theme, on_delete=models.PROTECT, related_name="learning_paths")
    introduction_markdown = models.TextField(blank=True)

    class Meta(DescribedContent.Meta):
        db_table = "lg_learning_path"
        constraints = DescribedContent.Meta.constraints + [models.UniqueConstraint(
            fields=["theme", "position"], name="lg_path_unique_position",
        )]


class Lesson(DescribedContent):
    CONTENT_KIND = ContentEntity.Kind.LESSON
    learning_path = models.ForeignKey(LearningPath, on_delete=models.PROTECT, related_name="lessons")
    introduction_markdown = models.TextField(blank=True)

    class Meta(DescribedContent.Meta):
        db_table = "lg_lesson"
        constraints = DescribedContent.Meta.constraints + [models.UniqueConstraint(
            fields=["learning_path", "position"], name="lg_lesson_unique_position",
        )]


class Card(IllustrationMixin, ProvenancedContent):
    CONTENT_KIND = ContentEntity.Kind.CARD
    lesson = models.ForeignKey(Lesson, on_delete=models.PROTECT, related_name="cards")
    title = models.CharField(max_length=255)
    body_markdown = models.TextField()

    class Meta(ContentRecord.Meta):
        db_table = "lg_card"
        constraints = ContentRecord.Meta.constraints + [models.UniqueConstraint(
            fields=["lesson", "position"], name="lg_card_unique_position",
        )]


class Question(ProvenancedContent):
    class Type(models.TextChoices):
        MULTIPLE_CHOICE = "multiple_choice", "Multiple choice"
        TYPE_ANSWER_QUESTION = "type_answer_question", "Type your answer"

    CONTENT_KIND = ContentEntity.Kind.QUESTION
    lesson = models.ForeignKey(Lesson, on_delete=models.PROTECT, related_name="questions")
    after_card_position = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    type = models.CharField(max_length=32, choices=Type.choices, default=Type.MULTIPLE_CHOICE)
    prompt = models.TextField()
    # Choice questions store four options and an answer ID. Typed questions
    # store no options and an authored canonical answer plus accepted variants.
    options = models.JSONField(default=list, blank=True)
    answer = models.CharField(max_length=255)
    accepted_answers = models.JSONField(default=list, blank=True)
    explanation = models.TextField()

    class Meta(ContentRecord.Meta):
        db_table = "lg_question"
        constraints = ContentRecord.Meta.constraints + [
            models.UniqueConstraint(fields=["lesson", "position"], name="lg_question_unique_position"),
            models.CheckConstraint(condition=Q(type__in=["multiple_choice", "type_answer_question"]), name="lg_question_valid_type"),
            models.CheckConstraint(condition=Q(after_card_position__gte=1), name="lg_question_positive_checkpoint"),
        ]
        indexes = [models.Index(fields=["lesson", "after_card_position"], name="lg_question_checkpoint_idx")]

    def clean(self):
        super().clean()
        if (
            self.lesson_id
            and isinstance(self.after_card_position, int)
            and self.after_card_position >= 1
            and not Card.objects.filter(
                lesson_id=self.lesson_id, position=self.after_card_position,
            ).exists()
        ):
            raise ValidationError({
                "after_card_position": "Checkpoint must reference a card position in the same lesson.",
            })
        if self.type == self.Type.TYPE_ANSWER_QUESTION:
            from .grading import normalize_typed_answer

            if self.options:
                raise ValidationError({"options": "Typed-answer questions cannot have choices."})
            answers = self.accepted_answers
            if not isinstance(answers, list) or not answers or any(
                not isinstance(answer, str) or not answer.strip() or len(answer) > 255
                for answer in answers
            ):
                raise ValidationError({"accepted_answers": "Provide nonempty answers up to 255 characters."})
            if self.answer != answers[0]:
                raise ValidationError({"answer": "The first accepted answer must be the canonical answer."})
            normalized = [normalize_typed_answer(answer) for answer in answers]
            if any(not answer for answer in normalized) or len(set(normalized)) != len(normalized):
                raise ValidationError({"accepted_answers": "Accepted answers must be distinct after normalization."})
            return
        if self.type != self.Type.MULTIPLE_CHOICE:
            return
        if self.accepted_answers:
            raise ValidationError({"accepted_answers": "Choice questions cannot have typed answers."})
        options = self.options
        valid = isinstance(options, list) and len(options) == 4
        if valid:
            valid = all(
                isinstance(option, dict)
                and isinstance(option.get("id"), str) and option["id"].strip()
                and len(option["id"]) <= 255
                and isinstance(option.get("text"), str) and option["text"].strip()
                for option in options
            )
        if not valid:
            raise ValidationError({"options": "Provide exactly four choices with nonempty string IDs and text."})
        ids = [option["id"] for option in options]
        if len(set(ids)) != 4:
            raise ValidationError({"options": "Choice IDs must be unique."})
        if self.answer not in ids:
            raise ValidationError({"answer": "Answer must reference one of the four choice IDs."})


class SyncLog(models.Model):
    updated_at = models.DateTimeField(auto_now_add=True)
    commit_sha = models.CharField(max_length=64, unique=True)
    changes = models.JSONField(default=dict)

    class Meta:
        db_table = "lg_sync_log"
        ordering = ["-updated_at", "-pk"]


class CardProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="lg_card_progress")
    card = models.ForeignKey(Card, on_delete=models.PROTECT, related_name="progress")
    completed_at = models.DateTimeField()

    class Meta:
        db_table = "lg_card_progress"
        constraints = [models.UniqueConstraint(fields=["user", "card"], name="lg_progress_unique_user_card")]


class LessonOpen(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="lg_opened_lessons")
    lesson = models.ForeignKey(Lesson, on_delete=models.PROTECT, related_name="opens")
    opened_at = models.DateTimeField()

    class Meta:
        db_table = "lg_lesson_open"
        constraints = [models.UniqueConstraint(fields=["user", "lesson"], name="lg_open_unique_user_lesson")]
        indexes = [models.Index(fields=["user", "-opened_at"], name="lg_open_recent_idx")]


class QuestionAttempt(models.Model):
    class AttemptType(models.TextChoices):
        INITIAL = "initial", "Initial"
        RETRY = "retry", "Retry"
        REVIEW = "review", "Review"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="lg_question_attempts")
    question = models.ForeignKey(Question, on_delete=models.PROTECT, related_name="attempts")
    attempt_type = models.CharField(max_length=10, choices=AttemptType.choices)
    submitted_answer = models.CharField(max_length=255)
    correct = models.BooleanField()
    answered_at = models.DateTimeField()

    class Meta:
        db_table = "lg_question_attempt"
        ordering = ["answered_at", "pk"]
        constraints = [models.CheckConstraint(
            condition=Q(attempt_type__in=["initial", "retry", "review"]), name="lg_attempt_valid_type",
        )]
        indexes = [models.Index(fields=["user", "question", "answered_at"], name="lg_attempt_review_idx")]
