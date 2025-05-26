from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile

import cv2
import joblib
import mediapipe
import numpy as np

from .. import constants


class ModelUtils:
    """Model utilities."""

    _pca_model = None
    _clf_model = None
    _pose = None

    @classmethod
    def get_pca_model(cls) -> object:
        """Get the PCA model."""
        if cls._pca_model is None:
            cls._pca_model = joblib.load(
                settings.BASE_DIR / "models/pca.joblib",
            )
        return cls._pca_model

    @classmethod
    def get_clf_model(cls) -> object:
        """Get the classifier model."""
        if cls._clf_model is None:
            cls._clf_model = joblib.load(
                settings.BASE_DIR / "models/MLPClassifier_pca.joblib",
            )
        return cls._clf_model

    @classmethod
    def get_pose(cls) -> object:
        """Get the pose model."""
        if cls._pose is None:
            cls._pose = mediapipe.solutions.pose.Pose(static_image_mode=True)
        return cls._pose


def normalize_landmarks(landmarks: list) -> list:
    """Normalize a list of pose landmarks.

    This function brings the center (mean of outer most x, y) to (0, 0)
    and scales so that the maximum distance from the center is 0.5.
    Also remove the z coordinate.

    Args:
        landmarks (list): A flat list of landmark values

    Returns:
        list: The normalized landmark list in the same format.

    """
    landmarks = np.array(landmarks).reshape(-1, 4)
    max_x = np.max(landmarks[:, 0])
    min_x = np.min(landmarks[:, 0])
    max_y = np.max(landmarks[:, 1])
    min_y = np.min(landmarks[:, 1])

    # Get center
    center_x = (max_x + min_x) / 2
    center_y = (max_y + min_y) / 2

    # Bring center to (0, 0, 0)
    landmarks[:, 0] -= center_x
    landmarks[:, 1] -= center_y

    # Get max distance from center
    max_distance = np.max(
        np.sqrt(
            landmarks[:, 0] ** 2 + landmarks[:, 1] ** 2 + landmarks[:, 2] ** 2,
        ),
    )

    # Scale to 0.5
    scale = 0.5 / max_distance
    landmarks[:, 0] *= scale
    landmarks[:, 1] *= scale

    # Remove z coordinate
    landmarks = landmarks[:, :2]

    # Flatten the array and convert to list
    landmarks = landmarks.flatten().tolist()
    return landmarks


def classify_image_action(
    image: InMemoryUploadedFile,
) -> constants.CultivatingActionType | None:
    """Classify an image and return the action string."""
    image = cv2.imdecode(
        np.frombuffer(image.read(), np.uint8),
        cv2.IMREAD_COLOR_BGR,
    )
    results = ModelUtils.get_pose().process(image)
    if not results.pose_landmarks:
        return None
    landmarks = []
    for landmark in results.pose_landmarks.landmark:
        landmarks.append(landmark.x)
        landmarks.append(landmark.y)
        landmarks.append(landmark.z)
        landmarks.append(landmark.visibility)

    landmarks = normalize_landmarks(landmarks)

    pca_landmarks = ModelUtils.get_pca_model().transform([landmarks])[0]
    landmarks_array = np.array(pca_landmarks).reshape(1, -1)
    prediction = ModelUtils.get_clf_model().predict(landmarks_array)[0]

    return constants.CultivatingActionType(prediction)
