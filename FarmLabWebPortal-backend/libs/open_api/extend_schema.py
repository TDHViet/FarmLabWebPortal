from rest_framework.views import APIView

from libs.open_api.view_fixers import ApiViewFix


def fix_api_view_warning(class_to_fix: type[APIView]):
    """Fix warning `This is graceful fallback handling for APIViews`."""

    class FixedApiView(ApiViewFix):
        """Generated fixed class."""

        target_class = f"{class_to_fix.__module__}.{class_to_fix.__name__}"

    return FixedApiView
