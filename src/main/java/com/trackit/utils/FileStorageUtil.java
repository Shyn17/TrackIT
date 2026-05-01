package com.trackit.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileStorageUtil {

    private final Path fileStorageLocation;

    public FileStorageUtil() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the file's name contains invalid characters
            if(fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Validate file type
            validateFileType(file);

            // Validate file size (max 10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds maximum limit of 10MB");
            }

            // Generate unique filename
            String fileExtension = getFileExtension(fileName);
            String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    private void validateFileType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new RuntimeException("File type not detected");
        }

        // Allow common file types for bug reports
        if (!contentType.equals("image/jpeg") &&
            !contentType.equals("image/png") &&
            !contentType.equals("image/gif") &&
            !contentType.equals("application/pdf") &&
            !contentType.equals("text/plain") &&
            !contentType.equals("application/zip") &&
            !contentType.startsWith("text/")) {
            throw new RuntimeException("File type not supported. Allowed types: images, PDF, text files, and zip archives");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) return "";
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    public Path getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }

    public boolean deleteFile(String fileName) {
        try {
            Path filePath = getFilePath(fileName);
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName, ex);
        }
    }

    public boolean fileExists(String fileName) {
        Path filePath = getFilePath(fileName);
        return Files.exists(filePath);
    }
}