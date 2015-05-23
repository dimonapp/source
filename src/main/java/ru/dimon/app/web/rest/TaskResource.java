package ru.dimon.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import ru.dimon.app.domain.Task;
import ru.dimon.app.repository.TaskRepository;
import ru.dimon.app.repository.search.TaskSearchRepository;
import ru.dimon.app.security.SecurityUtils;
import ru.dimon.app.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Task.
 */
@RestController
@RequestMapping("/api")
public class TaskResource {

    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    @Inject
    private TaskRepository taskRepository;

    @Inject
    private TaskSearchRepository taskSearchRepository;

    /**
     * POST  /tasks -> Create a new task.
     */
    @RequestMapping(value = "/tasks",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody Task task) throws URISyntaxException {
        log.debug("REST request to save Task : {}", task);
        if (task.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new task cannot already have an ID").build();
        }
        taskRepository.save(task);
        taskSearchRepository.save(task);
        return ResponseEntity.created(new URI("/api/tasks/" + task.getId())).build();
    }

    /**
     * PUT  /tasks -> Updates an existing task.
     */
    @RequestMapping(value = "/tasks",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody Task task) throws URISyntaxException {
        log.debug("REST request to update Task : {}", task);
        if (task.getId() == null) {
            return create(task);
        }
        taskRepository.save(task);
        taskSearchRepository.save(task);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /tasks -> get all the tasks, created by the current user.
     */
    @RequestMapping(value = "/tasks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Task>> getAll(@RequestParam(value = "page", required = false) Integer offset,
                                             @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<Task> page = taskRepository.findByCreatedBy(PaginationUtil.generatePageRequest(offset, limit), SecurityUtils.getCurrentLogin());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tasks", offset, limit);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /tasks/:id -> get the "id" task.
     */
    @RequestMapping(value = "/tasks/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Task> get(@PathVariable Long id) {
        log.debug("REST request to get Task : {}", id);
        return Optional.ofNullable(taskRepository.findOne(id))
            .map(task -> new ResponseEntity<>(
                task,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /tasks/:id -> delete the "id" task.
     */
    @RequestMapping(value = "/tasks/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete Task : {}", id);
        taskRepository.delete(id);
        taskSearchRepository.delete(id);
    }

    /**
     * SEARCH  /_search/tasks/:query -> search for the task corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/tasks/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Task> search(@PathVariable String query) {
        return StreamSupport
            .stream(taskSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
