package es.imserso.sample.monoliticapp1.web.rest;

import es.imserso.sample.monoliticapp1.domain.Aplicacion;
import es.imserso.sample.monoliticapp1.repository.AplicacionRepository;
import es.imserso.sample.monoliticapp1.service.AplicacionService;
import es.imserso.sample.monoliticapp1.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link es.imserso.sample.monoliticapp1.domain.Aplicacion}.
 */
@RestController
@RequestMapping("/api/aplicacions")
public class AplicacionResource {

    private static final Logger LOG = LoggerFactory.getLogger(AplicacionResource.class);

    private static final String ENTITY_NAME = "aplicacion";

    @Value("${jhipster.clientApp.name:jhipsterMonoliticSampleApplication}")
    private String applicationName;

    private final AplicacionService aplicacionService;

    private final AplicacionRepository aplicacionRepository;

    public AplicacionResource(AplicacionService aplicacionService, AplicacionRepository aplicacionRepository) {
        this.aplicacionService = aplicacionService;
        this.aplicacionRepository = aplicacionRepository;
    }

    /**
     * {@code POST  /aplicacions} : Create a new aplicacion.
     *
     * @param aplicacion the aplicacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new aplicacion, or with status {@code 400 (Bad Request)} if the aplicacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Aplicacion> createAplicacion(@Valid @RequestBody Aplicacion aplicacion) throws URISyntaxException {
        LOG.debug("REST request to save Aplicacion : {}", aplicacion);
        if (aplicacion.getId() != null) {
            throw new BadRequestAlertException("A new aplicacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        aplicacion = aplicacionService.save(aplicacion);
        return ResponseEntity.created(new URI("/api/aplicacions/" + aplicacion.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, aplicacion.getId().toString()))
            .body(aplicacion);
    }

    /**
     * {@code PUT  /aplicacions/:id} : Updates an existing aplicacion.
     *
     * @param id the id of the aplicacion to save.
     * @param aplicacion the aplicacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aplicacion,
     * or with status {@code 400 (Bad Request)} if the aplicacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the aplicacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Aplicacion> updateAplicacion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Aplicacion aplicacion
    ) throws URISyntaxException {
        LOG.debug("REST request to update Aplicacion : {}, {}", id, aplicacion);
        if (aplicacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aplicacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aplicacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        aplicacion = aplicacionService.update(aplicacion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aplicacion.getId().toString()))
            .body(aplicacion);
    }

    /**
     * {@code PATCH  /aplicacions/:id} : Partial updates given fields of an existing aplicacion, field will ignore if it is null
     *
     * @param id the id of the aplicacion to save.
     * @param aplicacion the aplicacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aplicacion,
     * or with status {@code 400 (Bad Request)} if the aplicacion is not valid,
     * or with status {@code 404 (Not Found)} if the aplicacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the aplicacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Aplicacion> partialUpdateAplicacion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Aplicacion aplicacion
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Aplicacion partially : {}, {}", id, aplicacion);
        if (aplicacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aplicacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aplicacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Aplicacion> result = aplicacionService.partialUpdate(aplicacion);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aplicacion.getId().toString())
        );
    }

    /**
     * {@code GET  /aplicacions} : get all the aplicacions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of aplicacions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Aplicacion>> getAllAplicacions(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Aplicacions");
        Page<Aplicacion> page = aplicacionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /aplicacions/:id} : get the "id" aplicacion.
     *
     * @param id the id of the aplicacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the aplicacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Aplicacion> getAplicacion(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Aplicacion : {}", id);
        Optional<Aplicacion> aplicacion = aplicacionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(aplicacion);
    }

    /**
     * {@code DELETE  /aplicacions/:id} : delete the "id" aplicacion.
     *
     * @param id the id of the aplicacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAplicacion(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Aplicacion : {}", id);
        aplicacionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
