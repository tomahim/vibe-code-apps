import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("learning", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="theme",
            name="introduction_markdown",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="learningpath",
            name="introduction_markdown",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="card",
            name="title",
            field=models.CharField(max_length=255),
        ),
        migrations.AddField(
            model_name="question",
            name="after_card_position",
            field=models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AddConstraint(
            model_name="question",
            constraint=models.CheckConstraint(
                condition=models.Q(after_card_position__gte=1), name="lg_question_positive_checkpoint",
            ),
        ),
        migrations.AddIndex(
            model_name="question",
            index=models.Index(fields=["lesson", "after_card_position"], name="lg_question_checkpoint_idx"),
        ),
    ]
