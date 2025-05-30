# Generated by Django 5.1.5 on 2025-05-13 14:56

import django.db.models.deletion
from django.db import migrations, models

import django_extensions.db.fields


class Migration(migrations.Migration):
    dependencies = [
        ("farmlabs", "0008_alter_farmlab_token"),
    ]

    operations = [
        migrations.CreateModel(
            name="CultivationLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    django_extensions.db.fields.CreationDateTimeField(
                        auto_now_add=True,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    django_extensions.db.fields.ModificationDateTimeField(
                        auto_now=True,
                        verbose_name="modified",
                    ),
                ),
                (
                    "action",
                    models.CharField(
                        choices=[
                            ("checking", "Kiểm tra"),
                            ("fertilizing", "Bón phân"),
                            ("hoeing", "Cày xới"),
                            ("planting", "Gieo trồng"),
                            ("prunning", "Tỉa cành"),
                            ("watering", "Tưới nước"),
                            ("weeding", "Nhổ cỏ"),
                        ],
                        default=None,
                        max_length=15,
                        null=True,
                    ),
                ),
                (
                    "farm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="cultivation_logs",
                        to="farmlabs.farmlab",
                    ),
                ),
                (
                    "sector",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="cultivation_logs",
                        to="farmlabs.sector",
                    ),
                ),
            ],
            options={
                "get_latest_by": "modified",
                "abstract": False,
            },
        ),
    ]
