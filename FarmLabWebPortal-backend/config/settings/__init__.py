from pathlib import Path

import decouple

from .authentication import *
from .cache import *
from .database import *
from .drf import *
from .installed_apps import *
from .locale import *
from .middleware import *
from .templates import *

CSRF_TRUSTED_ORIGINS = decouple.config(
    "CSRF_TRUSTED_ORIGINS",
    default=[],
    cast=decouple.Csv(),
)

# Build paths inside the project like this: BASE_DIR / "subdir".
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = decouple.config("SECRET_KEY")

# SECURITY WARNING: don"t run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

FORCE_SCRIPT_NAME = decouple.config("FORCE_SCRIPT_NAME")

CENTER_USERNAME = decouple.config("CENTER_USERNAME")
CENTER_PASSWORD = decouple.config("CENTER_PASSWORD")
