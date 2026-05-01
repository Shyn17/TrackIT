package com.trackit.repository.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.trackit.model.Priority;
import com.trackit.model.Severity;
import com.trackit.model.Task;
import com.trackit.model.TaskStatus;

import jakarta.persistence.criteria.Predicate;

public class TaskSpecification {

    public static Specification<Task> build(
            TaskStatus status,
            Priority priority,
            Severity severity,
            Long assignedDeveloperId,
            String keyword
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }

            if (severity != null) {
                predicates.add(cb.equal(root.get("severity"), severity));
            }

            if (assignedDeveloperId != null) {
                predicates.add(
                        cb.equal(root.get("assignedTo").get("id"), assignedDeveloperId)
                );
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("title")), pattern),
                                cb.like(cb.lower(root.get("description")), pattern)
                        )
                );
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
