package ru.dimon.app.repository;

import ru.dimon.app.domain.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Task entity.
 */
public interface TaskRepository extends JpaRepository<Task, Long> {
    /**
     * Find tasks, which are created by the given user.
     *
     * @param createdBy User
     * @return Tasks created by user
     */
    Page<Task> findByCreatedBy(Pageable page, String createdBy);

}
