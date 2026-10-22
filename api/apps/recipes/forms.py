from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from unfold.widgets import UnfoldAdminFileFieldWidget

from .models import Recipe


class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ("title", "source_url", "image")


class RecipeImportForm(forms.Form):
    archive = forms.FileField(
        label="ZIP archive",
        validators=[FileExtensionValidator(["zip"])],
        widget=UnfoldAdminFileFieldWidget(attrs={"accept": ".zip,application/zip"}),
        help_text="Up to 50 MiB, containing data.csv and an images/ folder.",
    )


def clean_ingredients(value):
    if not isinstance(value, list) or not value or len(value) > 100:
        raise ValidationError("Provide between 1 and 100 ingredients.")
    result = []
    seen = set()
    for item in value:
        if not isinstance(item, dict) or not isinstance(item.get("name"), str):
            raise ValidationError("Each ingredient needs a string name.")
        name = item["name"].strip().lower()
        quantity = item.get("quantity", "")
        if not name or len(name) > 200 or not isinstance(quantity, str) or len(quantity) > 200:
            raise ValidationError("Ingredient names and quantities must be strings of at most 200 characters; names cannot be empty.")
        if name in seen:
            raise ValidationError(f"Duplicate ingredient: {name}.")
        seen.add(name)
        result.append((name, quantity.strip()))
    return result
