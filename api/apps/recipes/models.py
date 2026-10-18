from django.db import models

from config.media import app_upload_to, validate_image_upload


class Recipe(models.Model):
    """Etchebest recipe with optional photo and ingredient quantities."""

    title = models.CharField(max_length=200)
    source_url = models.URLField(blank=True)
    # Only the storage key is stored (recipes/<uuid>.<ext>), never image bytes.
    image = models.ImageField(
        upload_to=app_upload_to("recipes"),
        validators=[validate_image_upload],
        blank=True,
    )
    ingredients = models.ManyToManyField("Ingredient", through="RecipeIngredient", related_name="recipes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Ingredient(models.Model):
    name = models.CharField(max_length=200, unique=True)

    class Meta:
        ordering = ["name"]

    def clean(self):
        super().clean()
        self.name = self.name.strip().lower()

    def save(self, *args, **kwargs):
        self.name = self.name.strip().lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredient_entries")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["ingredient__name"]
        constraints = [
            models.UniqueConstraint(fields=["recipe", "ingredient"], name="unique_recipe_ingredient")
        ]

    def __str__(self):
        return f"{self.ingredient}: {self.quantity}" if self.quantity else str(self.ingredient)
