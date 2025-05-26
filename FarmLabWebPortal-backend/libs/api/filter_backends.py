from django import forms
from django.template import loader

from django_filters.rest_framework import DjangoFilterBackend, FilterSet


class CustomDjangoFilterBackend(DjangoFilterBackend):
    """Customized DjangoFilterBackend to reduce queries count."""

    def to_html(
        self,
        request,
        queryset,
        view,
    ) -> str | None:  # pragma: no cover
        """Convert ModelChoiceField's widget to TextInput."""
        filterset: FilterSet | None = self.get_filterset(
            request=request,
            queryset=queryset,
            view=view,
        )
        if filterset is None:
            return None

        form: forms.Form = filterset.form
        for field in form.fields.values():
            if isinstance(field, forms.ModelChoiceField):
                field.widget = forms.TextInput()
        template = loader.get_template(template_name=self.template)
        context = {
            "filter": filterset,
        }
        return template.render(context, request)
