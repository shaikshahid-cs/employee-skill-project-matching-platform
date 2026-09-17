package com.employeematching.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class DocumentTextExtractionService {

    private final Tika tika = new Tika();

    public String extractText(String filePath) {

        try (InputStream inputStream =
                     Files.newInputStream(Path.of(filePath))) {

            return tika.parseToString(inputStream);

        } catch (IOException | TikaException e) {
            throw new RuntimeException(
                    "Failed to extract text from document", e);
        }
    }
}