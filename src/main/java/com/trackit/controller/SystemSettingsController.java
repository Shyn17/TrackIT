package com.trackit.controller;

import com.trackit.model.SystemSettings;
import com.trackit.service.SystemSettingsService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
public class SystemSettingsController {

    private final SystemSettingsService systemSettingsService;

    @GetMapping
    public List<SystemSettings> getAllSettings() {
        return systemSettingsService.getAllSettings();
    }

    @PutMapping("/{key}")
    public SystemSettings updateSetting(@PathVariable String key, @RequestBody String value) {
        return systemSettingsService.updateSetting(key, value);
    }
}