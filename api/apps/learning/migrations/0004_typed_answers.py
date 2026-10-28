from django.db import migrations, models
from django.db.models import Q


class Migration(migrations.Migration):
    dependencies = [("learning", "0003_lessonopen")]

    operations = [
        migrations.AddField(
            model_name="question",
            name="accepted_answers",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name="question",
            name="options",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name="question",
            name="type",
            field=models.CharField(choices=[("multiple_choice", "Multiple choice"),
                                            ("type_answer_question", "Type your answer")],
                                   default="multiple_choice", max_length=32),
        ),
        migrations.RemoveConstraint(model_name="question", name="lg_question_valid_type"),
        migrations.AddConstraint(
            model_name="question",
            constraint=models.CheckConstraint(
                condition=Q(type__in=["multiple_choice", "type_answer_question"]),
                name="lg_question_valid_type",
            ),
        ),
    ]
