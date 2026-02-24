package es.imserso.sample.monoliticapp1.web.rest;

import es.imserso.sample.monoliticapp1.domain.EnvioMasivo;
import es.imserso.sample.monoliticapp1.repository.EnvioMasivoRepository;
import es.imserso.sample.monoliticapp1.service.EnvioMasivoService;
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
 * REST controller for managing {@link es.imserso.sample.monoliticapp1.domain.EnvioMasivo}.
 */
@RestController
@RequestMapping("/api/envio-masivos")
public class EnvioMasivoResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnvioMasivoResource.class);

    private static final String ENTITY_NAME = "envioMasivo";

    @Value("${jhipster.clientApp.name:jhipsterMonoliticSampleApplication}")
    private String applicationName;

    private final EnvioMasivoService envioMasivoService;

    private final EnvioMasivoRepository envioMasivoRepository;

    public EnvioMasivoResource(EnvioMasivoService envioMasivoService, EnvioMasivoRepository envioMasivoRepository) {
        this.envioMasivoService = envioMasivoService;
        this.envioMasivoRepository = envioMasivoRepository;
    }

    /**
     * {@code POST  /envio-masivos} : Create a new envioMasivo.
     *
     * @param envioMasivo the envioMasivo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new envioMasivo, or with status {@code 400 (Bad Request)} if the envioMasivo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<EnvioMasivo> createEnvioMasivo(@Valid @RequestBody EnvioMasivo envioMasivo) throws URISyntaxException {
        LOG.debug("REST request to save EnvioMasivo : {}", envioMasivo);
        if (envioMasivo.getId() != null) {
            throw new BadRequestAlertException("A new envioMasivo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        envioMasivo = envioMasivoService.save(envioMasivo);
        return ResponseEntity.created(new URI("/api/envio-masivos/" + envioMasivo.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, envioMasivo.getId().toString()))
            .body(envioMasivo);
    }

    /**
     * {@code PUT  /envio-masivos/:id} : Updates an existing envioMasivo.
     *
     * @param id the id of the envioMasivo to save.
     * @param envioMasivo the envioMasivo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated envioMasivo,
     * or with status {@code 400 (Bad Request)} if the envioMasivo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the envioMasivo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EnvioMasivo> updateEnvioMasivo(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EnvioMasivo envioMasivo
    ) throws URISyntaxException {
        LOG.debug("REST request to update EnvioMasivo : {}, {}", id, envioMasivo);
        if (envioMasivo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, envioMasivo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!envioMasivoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        envioMasivo = envioMasivoService.update(envioMasivo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, envioMasivo.getId().toString()))
            .body(envioMasivo);
    }

    /**
     * {@code PATCH  /envio-masivos/:id} : Partial updates given fields of an existing envioMasivo, field will ignore if it is null
     *
     * @param id the id of the envioMasivo to save.
     * @param envioMasivo the envioMasivo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated envioMasivo,
     * or with status {@code 400 (Bad Request)} if the envioMasivo is not valid,
     * or with status {@code 404 (Not Found)} if the envioMasivo is not found,
     * or with status {@code 500 (Internal Server Error)} if the envioMasivo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EnvioMasivo> partialUpdateEnvioMasivo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EnvioMasivo envioMasivo
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update EnvioMasivo partially : {}, {}", id, envioMasivo);
        if (envioMasivo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, envioMasivo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!envioMasivoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EnvioMasivo> result = envioMasivoService.partialUpdate(envioMasivo);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, envioMasivo.getId().toString())
        );
    }

    /**
     * {@code GET  /envio-masivos} : get all the envioMasivos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of envioMasivos in body.
     */
    @GetMapping("")
    public ResponseEntity<List<EnvioMasivo>> getAllEnvioMasivos(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of EnvioMasivos");
        Page<EnvioMasivo> page = envioMasivoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /envio-masivos/:id} : get the "id" envioMasivo.
     *
     * @param id the id of the envioMasivo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the envioMasivo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EnvioMasivo> getEnvioMasivo(@PathVariable("id") Long id) {
        LOG.debug("REST request to get EnvioMasivo : {}", id);
        Optional<EnvioMasivo> envioMasivo = envioMasivoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(envioMasivo);
    }

    /**
     * {@code DELETE  /envio-masivos/:id} : delete the "id" envioMasivo.
     *
     * @param id the id of the envioMasivo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnvioMasivo(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete EnvioMasivo : {}", id);
        envioMasivoService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
