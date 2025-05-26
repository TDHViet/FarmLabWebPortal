from django.core.exceptions import FieldError

from rest_framework import filters

from drf_spectacular import drainage


class OrderingFilterBackend(filters.OrderingFilter):
    """Custom OrderingFilter for better support of openapi."""

    def get_schema_operation_parameters(self, view):
        """Prepare parameters for openapi schema.

        Check that view has `ordering_fields`.

        Check that `ordering_fields` contains valid set of fields. Actually,
        this check may perform some SQL queries during spec generation. Also,
        spec generation is not the best place for checking of source code
        (comparing to linters/django system checks/tests), but DRF doesn't
        validate `ordering_fields` for views while backend running.

        Extend view description with list of `ordering_fields`.

        """
        operation_parameters = super().get_schema_operation_parameters(
            view=view,
        )
        # Not using get_valid_fields since it is requires additional params
        if not hasattr(view, "ordering_fields"):  # pragma: no cover
            drainage.warn(
                f"`ordering_fields` are not set up for {view.__class__}",
            )
            return operation_parameters

        self._validate_ordering_fields(view)

        formatted_fields = ", ".join(
            f"`{field}`" for field in view.ordering_fields
        )
        operation_parameters[0]["description"] = (
            "Which fields to use when ordering the results. A list "
            "fields separated by `,`. Example: `field1,field2`\n\n"
            f"Supported fields: {formatted_fields}.\n\n"
            "To reverse order just add `-` to field. Example:"
            "`field` -> `-field`"
        )
        return operation_parameters

    def _validate_ordering_fields(self, view) -> None:
        """Validate `ordering_fields` in view."""
        try:
            view.get_queryset().order_by(*view.ordering_fields)
        except FieldError as error:  # pragma: no cover
            drainage.warn(
                "`ordering_fields` contains non-existent"
                " or non-related fields."
                f" {error}",
            )


class SearchFilterBackend(filters.SearchFilter):
    """Custom SearchFilter for better support of openapi."""

    def get_schema_operation_parameters(self, view):
        """Prepare parameters for openapi schema.

        Check that view has `search_fields`.

        Check that `search_fields` contains valid set of fields. Actually,
        this check may perform some SQL queries during spec generation. Also,
        spec generation is not the best place for checking of source code
        (comparing to linters/django system checks/tests), but DRF doesn't
        validate `search_fields` for views while backend running.

        Extend view description with list of `search_fields`.

        """
        operation_parameters = super().get_schema_operation_parameters(
            view=view,
        )
        # Not using get_search_fields since it is requires additional params
        if not hasattr(view, "search_fields"):  # pragma: no cover
            drainage.warn(
                f"`search_fields` are not set up for {view.__class__}",
            )
            return operation_parameters

        self._validate_search_fields(view)

        formatted_fields = ", ".join(
            f"`{field}`" for field in view.search_fields
        )
        operation_parameters[0]["description"] = (
            f"A search term.\n\nPerformed on this fields: {formatted_fields}."
        )
        return operation_parameters

    def _validate_search_fields(self, view) -> None:
        """Validate `search_fields` in view."""
        try:
            search_dict = {}
            for search_field in view.search_fields:
                search_arg = self.construct_search(
                    str(search_field),
                    queryset=view.get_queryset(),
                )
                search_dict[search_arg] = "test"
            view.get_queryset().filter(**search_dict)
        except FieldError as error:  # pragma: no cover
            drainage.warn(
                "`search_fields` contains non-existent or non-related fields."
                f" {error}",
            )
