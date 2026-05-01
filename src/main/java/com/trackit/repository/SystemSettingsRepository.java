package com.trackit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trackit.model.SystemSettings;

public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {

    SystemSettings findBySettingKey(String key);
}