from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import UploadedFile
from .serializers import UploadedFileSerializer

class UploadedFileView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        print("Received Request Data:", request.data)
        print("Received Files:", request.FILES)

        files = request.FILES.getlist("files")  # Get multiple files
        category = request.data.get("category")

        if not files:
            return Response({"error": "No files uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        errors = []
        saved_files = []

        for file in files:
            # Check file size (Example: Limit to 5MB)
            if file.size > 5 * 1024 * 1024:
                errors.append(f"{file.name} is too large. Max 5MB.")
                continue  # Skip saving this file

            # Validate file format
            allowed_formats = ["pdf", "jpg", "jpeg", "png"]
            if not file.name.split(".")[-1].lower() in allowed_formats:
                errors.append(f"{file.name} is not a supported format.")
                continue  # Skip saving this file

            file_serializer = UploadedFileSerializer(data={"file": file, "category": category})

            if file_serializer.is_valid():
                file_serializer.save()
                saved_files.append(file.name)
            else:
                errors.append(f"{file.name} could not be uploaded. Invalid file.")

        if errors:
            return Response({"success": saved_files, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Files uploaded successfully!", "files": saved_files}, status=status.HTTP_201_CREATED)
