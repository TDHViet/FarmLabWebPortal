import decouple

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": decouple.config("DB_NAME"),
        "USER": decouple.config("DB_USER"),
        "PASSWORD": decouple.config("DB_PASSWORD"),
        "HOST": decouple.config("DB_HOST"),
        "PORT": decouple.config("DB_PORT"),
    },
}
