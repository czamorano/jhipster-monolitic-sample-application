package es.imserso.sample.monoliticapp1.web.rest;

import es.imserso.sample.monoliticapp1.domain.OrganismoEmisor;
import es.imserso.sample.monoliticapp1.repository.OrganismoEmisorRepository;
import es.imserso.sample.monoliticapp1.service.OrganismoEmisorService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link es.imserso.sample.monoliticapp1.domain.OrganismoEmisor}.
 */
@RestController
@RequestMapping("/api/organismo-emisors")
public class OrganismoEmisorResource {

    private static final Logger LOG = LoggerFactory.getLogger(OrganismoEmisorResource.class);

    private static final String ENTITY_NAME = "organismoEmisor";

    @Value("${jhipster.clientApp.name:jhipsterMonoliticSampleApplication}")
    private String applicationName;

    private final OrganismoEmisorService organismoEmisorService;

    private final OrganismoEmisorRepository organismoEmisorRepository;

    public OrganismoEmisorResource(OrganismoEmisorService organismoEmisorService, OrganismoEmisorRepository organismoEmisorRepository) {
        this.organismoEmisorService = organismoEmisorService;
        this.organismoEmisorRepository = organismoEmisorRepository;
    }

    /**
     * {@code POST  /organismo-emisors} : Create a new organismoEmisor.
     *
     * @param organismoEmisor the organismoEmisor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organismoEmisor, or with status {@code 400 (Bad Request)} if the organismoEmisor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<OrganismoEmisor> createOrganismoEmisor(@Valid @RequestBody OrganismoEmisor organismoEmisor)
        throws URISyntaxException {
        LOG.debug("REST request to save OrganismoEmisor : {}", organismoEmisor);
        if (organismoEmisor.getId() != null) {
            throw new BadRequestAlertException("A new organismoEmisor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        organismoEmisor = organismoEmisorService.save(organismoEmisor);
        return ResponseEntity.created(new URI("/api/organismo-emisors/" + organismoEmisor.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, organismoEmisor.getId().toString()))
            .body(organismoEmisor);
    }

    /**
     * {@code PUT  /organismo-emisors/:id} : Updates an existing organismoEmisor.
     *
     * @param id the id of the organismoEmisor to save.
     * @param organismoEmisor the organismoEmisor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organismoEmisor,
     * or with status {@code 400 (Bad Request)} if the organismoEmisor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organismoEmisor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrganismoEmisor> updateOrganismoEmisor(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OrganismoEmisor organismoEmisor
    ) throws URISyntaxException {
        LOG.debug("REST request to update OrganismoEmisor : {}, {}", id, organismoEmisor);
        if (organismoEmisor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organismoEmisor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organismoEmisorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        organismoEmisor = organismoEmisorService.update(organismoEmisor);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organismoEmisor.getId().toString()))
            .body(organismoEmisor);
    }

    /**
     * {@code PATCH  /organismo-emisors/:id} : Partial updates given fields of an existing organismoEmisor, field will ignore if it is null
     *
     * @param id the id of the organismoEmisor to save.
     * @param organismoEmisor the organismoEmisor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organismoEmisor,
     * or with status {@code 400 (Bad Request)} if the organismoEmisor is not valid,
     * or with status {@code 404 (Not Found)} if the organismoEmisor is not found,
     * or with status {@code 500 (Internal Server Error)} if the organismoEmisor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrganismoEmisor> partialUpdateOrganismoEmisor(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OrganismoEmisor organismoEmisor
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update OrganismoEmisor partially : {}, {}", id, organismoEmisor);
        if (organismoEmisor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organismoEmisor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organismoEmisorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrganismoEmisor> result = organismoEmisorService.partialUpdate(organismoEmisor);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organismoEmisor.getId().toString())
        );
    }

    /**
     * {@code GET  /organismo-emisors} : get all the organismoEmisors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organismoEmisors in body.
     */
    @GetMapping("")
    public List<OrganismoEmisor> getAllOrganismoEmisors() {
        LOG.debug("REST request to get all OrganismoEmisors");
        return organismoEmisorService.findAll();
    }

    /**
     * {@code GET  /organismo-emisors/:id} : get the "id" organismoEmisor.
     *
     * @param id the id of the organismoEmisor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organismoEmisor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrganismoEmisor> getOrganismoEmisor(@PathVariable("id") Long id) {
        LOG.debug("REST request to get OrganismoEmisor : {}", id);
        Optional<OrganismoEmisor> organismoEmisor = organismoEmisorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(organismoEmisor);
    }

    /**
     * {@code DELETE  /organismo-emisors/:id} : delete the "id" organismoEmisor.
     *
     * @param id the id of the organismoEmisor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganismoEmisor(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete OrganismoEmisor : {}", id);
        organismoEmisorService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
