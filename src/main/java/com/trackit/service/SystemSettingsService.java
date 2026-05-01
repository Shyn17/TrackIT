package com.trackit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.trackit.model.SystemSettings;
import com.trackit.repository.SystemSettingsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SystemSettingsService {

    private final SystemSettingsRepository systemSettingsRepository;

    public List<SystemSettings> getAllSettings() {
        return systemSettingsRepository.findAll();
    }

    public SystemSettings getSettingById(Long id) {
        return systemSettingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setting not found"));
    }

    public SystemSettings saveSetting(SystemSettings setting) {
        return systemSettingsRepository.save(setting);
    }

    public void deleteSetting(Long id) {
        systemSettingsRepository.deleteById(id);
    }

    public SystemSettings updateSetting(String key, String value) {
        SystemSettings setting = systemSettingsRepository.findBySettingKey(key);
        if (setting == null) {
            setting = new SystemSettings();
            setting.setSettingKey(key);
        }
        setting.setSettingValue(value);
        return systemSettingsRepository.save(setting);
    }
}