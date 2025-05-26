from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from drf_spectacular import views

from authentication.urls import urlpatterns as auth_urls
from farmlabs.urls import urlpatterns as farmlabs_urls
from users.urls import urlpatterns as users_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    *users_urls,
    *farmlabs_urls,
    *auth_urls,
    path("schema/", views.SpectacularAPIView.as_view(), name="schema"),
    path(
        route="docs/",
        view=views.SpectacularSwaggerView.as_view(),
        name="swagger",
    ),
    *static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    ),
]
