package es.imserso.sample.monoliticapp1.web.rest;

import static es.imserso.sample.monoliticapp1.domain.EnvioMasivoAsserts.*;
import static es.imserso.sample.monoliticapp1.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.imserso.sample.monoliticapp1.IntegrationTest;
import es.imserso.sample.monoliticapp1.domain.EnvioMasivo;
import es.imserso.sample.monoliticapp1.domain.enumeration.EstadoEnvioMasivo;
import es.imserso.sample.monoliticapp1.domain.enumeration.TipoEnvioMasivo;
import es.imserso.sample.monoliticapp1.repository.EnvioMasivoRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link EnvioMasivoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EnvioMasivoResourceIT {

    private static final String DEFAULT_IDENTIFICADOR = "AAAAAAAAAA";
    private static final String UPDATED_IDENTIFICADOR = "BBBBBBBBBB";

    private static final TipoEnvioMasivo DEFAULT_TIPO = TipoEnvioMasivo.CARTAS_ACREDITACION;
    private static final TipoEnvioMasivo UPDATED_TIPO = TipoEnvioMasivo.CARTAS_RENOVACION;

    private static final EstadoEnvioMasivo DEFAULT_ESTADO = EstadoEnvioMasivo.PREPARADO;
    private static final EstadoEnvioMasivo UPDATED_ESTADO = EstadoEnvioMasivo.INICIADO;

    private static final Instant DEFAULT_COMIENZO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_COMIENZO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/envio-masivos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EnvioMasivoRepository envioMasivoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEnvioMasivoMockMvc;

    private EnvioMasivo envioMasivo;

    private EnvioMasivo insertedEnvioMasivo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EnvioMasivo createEntity() {
        return new EnvioMasivo()
            .identificador(DEFAULT_IDENTIFICADOR)
            .tipo(DEFAULT_TIPO)
            .estado(DEFAULT_ESTADO)
            .comienzo(DEFAULT_COMIENZO)
            .fin(DEFAULT_FIN);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EnvioMasivo createUpdatedEntity() {
        return new EnvioMasivo()
            .identificador(UPDATED_IDENTIFICADOR)
            .tipo(UPDATED_TIPO)
            .estado(UPDATED_ESTADO)
            .comienzo(UPDATED_COMIENZO)
            .fin(UPDATED_FIN);
    }

    @BeforeEach
    void initTest() {
        envioMasivo = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedEnvioMasivo != null) {
            envioMasivoRepository.delete(insertedEnvioMasivo);
            insertedEnvioMasivo = null;
        }
    }

    @Test
    @Transactional
    void createEnvioMasivo() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the EnvioMasivo
        var returnedEnvioMasivo = om.readValue(
            restEnvioMasivoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(envioMasivo)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            EnvioMasivo.class
        );

        // Validate the EnvioMasivo in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEnvioMasivoUpdatableFieldsEquals(returnedEnvioMasivo, getPersistedEnvioMasivo(returnedEnvioMasivo));

        insertedEnvioMasivo = returnedEnvioMasivo;
    }

    @Test
    @Transactional
    void createEnvioMasivoWithExistingId() throws Exception {
        // Create the EnvioMasivo with an existing ID
        envioMasivo.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEnvioMasivoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(envioMasivo)))
            .andExpect(status().isBadRequest());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIdentificadorIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        envioMasivo.setIdentificador(null);

        // Create the EnvioMasivo, which fails.

        restEnvioMasivoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(envioMasivo)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTipoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        envioMasivo.setTipo(null);

        // Create the EnvioMasivo, which fails.

        restEnvioMasivoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(envioMasivo)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEstadoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        envioMasivo.setEstado(null);

        // Create the EnvioMasivo, which fails.

        restEnvioMasivoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(envioMasivo)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEnvioMasivos() throws Exception {
        // Initialize the database
        insertedEnvioMasivo = envioMasivoRepository.saveAndFlush(envioMasivo);

        // Get all the envioMasivoList
        restEnvioMasivoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(envioMasivo.getId().intValue())))
            .andExpect(jsonPath("$.[*].identificador").value(hasItem(DEFAULT_IDENTIFICADOR)))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].comienzo").value(hasItem(DEFAULT_COMIENZO.toString())))
            .andExpect(jsonPath("$.[*].fin").value(hasItem(DEFAULT_FIN.toString())));
    }

    @Test
    @Transactional
    void getEnvioMasivo() throws Exception {
        // Initialize the database
        insertedEnvioMasivo = envioMasivoRepository.saveAndFlush(envioMasivo);

        // Get the envioMasivo
        restEnvioMasivoMockMvc
            .perform(get(ENTITY_API_URL_ID, envioMasivo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(envioMasivo.getId().intValue()))
            .andExpect(jsonPath("$.identificador").value(DEFAULT_IDENTIFICADOR))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()))
            .andExpect(jsonPath("$.comienzo").value(DEFAULT_COMIENZO.toString()))
            .andExpect(jsonPath("$.fin").value(DEFAULT_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEnvioMasivo() throws Exception {
        // Get the envioMasivo
        restEnvioMasivoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEnvioMasivo() throws Exception {
        // Initialize the database
        insertedEnvioMasivo = envioMasivoRepository.saveAndFlush(envioMasivo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the envioMasivo
        EnvioMasivo updatedEnvioMasivo = envioMasivoRepository.findById(envioMasivo.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEnvioMasivo are not directly saved in db
        em.detach(updatedEnvioMasivo);
        updatedEnvioMasivo
            .identificador(UPDATED_IDENTIFICADOR)
            .tipo(UPDATED_TIPO)
            .estado(UPDATED_ESTADO)
            .comienzo(UPDATED_COMIENZO)
            .fin(UPDATED_FIN);

        restEnvioMasivoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEnvioMasivo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEnvioMasivo))
            )
            .andExpect(status().isOk());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEnvioMasivoToMatchAllProperties(updatedEnvioMasivo);
    }

    @Test
    @Transactional
    void putNonExistingEnvioMasivo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        envioMasivo.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnvioMasivoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, envioMasivo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(envioMasivo))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEnvioMasivo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        envioMasivo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnvioMasivoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(envioMasivo))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEnvioMasivo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        envioMasivo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnvioMasivoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(envioMasivo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEnvioMasivoWithPatch() throws Exception {
        // Initialize the database
        insertedEnvioMasivo = envioMasivoRepository.saveAndFlush(envioMasivo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the envioMasivo using partial update
        EnvioMasivo partialUpdatedEnvioMasivo = new EnvioMasivo();
        partialUpdatedEnvioMasivo.setId(envioMasivo.getId());

        partialUpdatedEnvioMasivo.estado(UPDATED_ESTADO).comienzo(UPDATED_COMIENZO).fin(UPDATED_FIN);

        restEnvioMasivoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnvioMasivo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEnvioMasivo))
            )
            .andExpect(status().isOk());

        // Validate the EnvioMasivo in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEnvioMasivoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEnvioMasivo, envioMasivo),
            getPersistedEnvioMasivo(envioMasivo)
        );
    }

    @Test
    @Transactional
    void fullUpdateEnvioMasivoWithPatch() throws Exception {
        // Initialize the database
        insertedEnvioMasivo = envioMasivoRepository.saveAndFlush(envioMasivo);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the envioMasivo using partial update
        EnvioMasivo partialUpdatedEnvioMasivo = new EnvioMasivo();
        partialUpdatedEnvioMasivo.setId(envioMasivo.getId());

        partialUpdatedEnvioMasivo
            .identificador(UPDATED_IDENTIFICADOR)
            .tipo(UPDATED_TIPO)
            .estado(UPDATED_ESTADO)
            .comienzo(UPDATED_COMIENZO)
            .fin(UPDATED_FIN);

        restEnvioMasivoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEnvioMasivo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEnvioMasivo))
            )
            .andExpect(status().isOk());

        // Validate the EnvioMasivo in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEnvioMasivoUpdatableFieldsEquals(partialUpdatedEnvioMasivo, getPersistedEnvioMasivo(partialUpdatedEnvioMasivo));
    }

    @Test
    @Transactional
    void patchNonExistingEnvioMasivo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        envioMasivo.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEnvioMasivoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, envioMasivo.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(envioMasivo))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEnvioMasivo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        envioMasivo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnvioMasivoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(envioMasivo))
            )
            .andExpect(status().isBadRequest());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEnvioMasivo() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        envioMasivo.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEnvioMasivoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(envioMasivo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EnvioMasivo in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEnvioMasivo() throws Exception {
        // Initialize the database
        insertedEnvioMasivo = envioMasivoRepository.saveAndFlush(envioMasivo);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the envioMasivo
        restEnvioMasivoMockMvc
            .perform(delete(ENTITY_API_URL_ID, envioMasivo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return envioMasivoRepository.count();
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

    protected EnvioMasivo getPersistedEnvioMasivo(EnvioMasivo envioMasivo) {
        return envioMasivoRepository.findById(envioMasivo.getId()).orElseThrow();
    }

    protected void assertPersistedEnvioMasivoToMatchAllProperties(EnvioMasivo expectedEnvioMasivo) {
        assertEnvioMasivoAllPropertiesEquals(expectedEnvioMasivo, getPersistedEnvioMasivo(expectedEnvioMasivo));
    }

    protected void assertPersistedEnvioMasivoToMatchUpdatableProperties(EnvioMasivo expectedEnvioMasivo) {
        assertEnvioMasivoAllUpdatablePropertiesEquals(expectedEnvioMasivo, getPersistedEnvioMasivo(expectedEnvioMasivo));
    }
}
