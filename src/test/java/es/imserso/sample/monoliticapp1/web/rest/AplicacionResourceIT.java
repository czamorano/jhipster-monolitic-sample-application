package es.imserso.sample.monoliticapp1.web.rest;

import static es.imserso.sample.monoliticapp1.domain.AplicacionAsserts.*;
import static es.imserso.sample.monoliticapp1.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.imserso.sample.monoliticapp1.IntegrationTest;
import es.imserso.sample.monoliticapp1.domain.Aplicacion;
import es.imserso.sample.monoliticapp1.repository.AplicacionRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AplicacionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AplicacionResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/aplicacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AplicacionRepository aplicacionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAplicacionMockMvc;

    private Aplicacion aplicacion;

    private Aplicacion insertedAplicacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aplicacion createEntity() {
        return new Aplicacion().nombre(DEFAULT_NOMBRE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aplicacion createUpdatedEntity() {
        return new Aplicacion().nombre(UPDATED_NOMBRE);
    }

    @BeforeEach
    void initTest() {
        aplicacion = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAplicacion != null) {
            aplicacionRepository.delete(insertedAplicacion);
            insertedAplicacion = null;
        }
    }

    @Test
    @Transactional
    void createAplicacion() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Aplicacion
        var returnedAplicacion = om.readValue(
            restAplicacionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aplicacion)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Aplicacion.class
        );

        // Validate the Aplicacion in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAplicacionUpdatableFieldsEquals(returnedAplicacion, getPersistedAplicacion(returnedAplicacion));

        insertedAplicacion = returnedAplicacion;
    }

    @Test
    @Transactional
    void createAplicacionWithExistingId() throws Exception {
        // Create the Aplicacion with an existing ID
        aplicacion.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAplicacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aplicacion)))
            .andExpect(status().isBadRequest());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aplicacion.setNombre(null);

        // Create the Aplicacion, which fails.

        restAplicacionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aplicacion)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAplicacions() throws Exception {
        // Initialize the database
        insertedAplicacion = aplicacionRepository.saveAndFlush(aplicacion);

        // Get all the aplicacionList
        restAplicacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(aplicacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)));
    }

    @Test
    @Transactional
    void getAplicacion() throws Exception {
        // Initialize the database
        insertedAplicacion = aplicacionRepository.saveAndFlush(aplicacion);

        // Get the aplicacion
        restAplicacionMockMvc
            .perform(get(ENTITY_API_URL_ID, aplicacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(aplicacion.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE));
    }

    @Test
    @Transactional
    void getNonExistingAplicacion() throws Exception {
        // Get the aplicacion
        restAplicacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAplicacion() throws Exception {
        // Initialize the database
        insertedAplicacion = aplicacionRepository.saveAndFlush(aplicacion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the aplicacion
        Aplicacion updatedAplicacion = aplicacionRepository.findById(aplicacion.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAplicacion are not directly saved in db
        em.detach(updatedAplicacion);
        updatedAplicacion.nombre(UPDATED_NOMBRE);

        restAplicacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAplicacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAplicacion))
            )
            .andExpect(status().isOk());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAplicacionToMatchAllProperties(updatedAplicacion);
    }

    @Test
    @Transactional
    void putNonExistingAplicacion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aplicacion.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAplicacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, aplicacion.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aplicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAplicacion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aplicacion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAplicacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(aplicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAplicacion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aplicacion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAplicacionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aplicacion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAplicacionWithPatch() throws Exception {
        // Initialize the database
        insertedAplicacion = aplicacionRepository.saveAndFlush(aplicacion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the aplicacion using partial update
        Aplicacion partialUpdatedAplicacion = new Aplicacion();
        partialUpdatedAplicacion.setId(aplicacion.getId());

        partialUpdatedAplicacion.nombre(UPDATED_NOMBRE);

        restAplicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAplicacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAplicacion))
            )
            .andExpect(status().isOk());

        // Validate the Aplicacion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAplicacionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAplicacion, aplicacion),
            getPersistedAplicacion(aplicacion)
        );
    }

    @Test
    @Transactional
    void fullUpdateAplicacionWithPatch() throws Exception {
        // Initialize the database
        insertedAplicacion = aplicacionRepository.saveAndFlush(aplicacion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the aplicacion using partial update
        Aplicacion partialUpdatedAplicacion = new Aplicacion();
        partialUpdatedAplicacion.setId(aplicacion.getId());

        partialUpdatedAplicacion.nombre(UPDATED_NOMBRE);

        restAplicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAplicacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAplicacion))
            )
            .andExpect(status().isOk());

        // Validate the Aplicacion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAplicacionUpdatableFieldsEquals(partialUpdatedAplicacion, getPersistedAplicacion(partialUpdatedAplicacion));
    }

    @Test
    @Transactional
    void patchNonExistingAplicacion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aplicacion.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAplicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, aplicacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(aplicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAplicacion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aplicacion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAplicacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(aplicacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAplicacion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aplicacion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAplicacionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(aplicacion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aplicacion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAplicacion() throws Exception {
        // Initialize the database
        insertedAplicacion = aplicacionRepository.saveAndFlush(aplicacion);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the aplicacion
        restAplicacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, aplicacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return aplicacionRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Aplicacion getPersistedAplicacion(Aplicacion aplicacion) {
        return aplicacionRepository.findById(aplicacion.getId()).orElseThrow();
    }

    protected void assertPersistedAplicacionToMatchAllProperties(Aplicacion expectedAplicacion) {
        assertAplicacionAllPropertiesEquals(expectedAplicacion, getPersistedAplicacion(expectedAplicacion));
    }

    protected void assertPersistedAplicacionToMatchUpdatableProperties(Aplicacion expectedAplicacion) {
        assertAplicacionAllUpdatablePropertiesEquals(expectedAplicacion, getPersistedAplicacion(expectedAplicacion));
    }
}
