from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
import os

class FileUploadView(APIView):
    parser_classes = [MultiPartParser]

    ALLOWED_FILE_TYPES = ["pdf", "jpg", "jpeg", "png"]  # Allowed extensions
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB limit

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')

        if not file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        # Validate file size
        if file.size > self.MAX_FILE_SIZE:
            return JsonResponse({"error": "File too large (max 5MB allowed)"}, status=400)

        # Validate file extension
        extension = file.name.split('.')[-1].lower()
        if extension not in self.ALLOWED_FILE_TYPES:
            return JsonResponse({"error": "Invalid file type. Allowed: pdf, jpg, png"}, status=400)

        # Save file to media folder
        file_path = os.path.join("media/uploads", file.name)
        default_storage.save(file_path, ContentFile(file.read()))

        return JsonResponse({"message": "File uploaded successfully", "file_url": f"/media/uploads/{file.name}"}, status=201)
