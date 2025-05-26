from drf_spectacular.extensions import OpenApiViewExtension


class ApiViewFix(OpenApiViewExtension):
    """Fixes warning `This is graceful fallback handling for APIViews`."""

    def view_replacement(self):
        """Generate replacement."""

        class Fixed(self.target_class):
            """Add needed properties."""

            serializer_class = None
            queryset = None

        return Fixed
