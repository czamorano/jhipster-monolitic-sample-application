package es.imserso.sample.monoliticapp1.web.rest;

import static es.imserso.sample.monoliticapp1.domain.OrganismoEmisorAsserts.*;
import static es.imserso.sample.monoliticapp1.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.imserso.sample.monoliticapp1.IntegrationTest;
import es.imserso.sample.monoliticapp1.domain.OrganismoEmisor;
import es.imserso.sample.monoliticapp1.repository.OrganismoEmisorRepository;
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
 * Integration tests for the {@link OrganismoEmisorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrganismoEmisorResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_CODIGO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/organismo-emisors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OrganismoEmisorRepository organismoEmisorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganismoEmisorMockMvc;

    private OrganismoEmisor organismoEmisor;

    private OrganismoEmisor insertedOrganismoEmisor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganismoEmisor createEntity() {
        return new OrganismoEmisor().nombre(DEFAULT_NOMBRE).codigo(DEFAULT_CODIGO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganismoEmisor createUpdatedEntity() {
        return new OrganismoEmisor().nombre(UPDATED_NOMBRE).codigo(UPDATED_CODIGO);
    }

    @BeforeEach
    void initTest() {
        organismoEmisor = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedOrganismoEmisor != null) {
            organismoEmisorRepository.delete(insertedOrganismoEmisor);
            insertedOrganismoEmisor = null;
        }
    }

    @Test
    @Transactional
    void createOrganismoEmisor() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the OrganismoEmisor
        var returnedOrganismoEmisor = om.readValue(
            restOrganismoEmisorMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(organismoEmisor)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            OrganismoEmisor.class
        );

        // Validate the OrganismoEmisor in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertOrganismoEmisorUpdatableFieldsEquals(returnedOrganismoEmisor, getPersistedOrganismoEmisor(returnedOrganismoEmisor));

        insertedOrganismoEmisor = returnedOrganismoEmisor;
    }

    @Test
    @Transactional
    void createOrganismoEmisorWithExistingId() throws Exception {
        // Create the OrganismoEmisor with an existing ID
        organismoEmisor.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganismoEmisorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(organismoEmisor)))
            .andExpect(status().isBadRequest());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        organismoEmisor.setNombre(null);

        // Create the OrganismoEmisor, which fails.

        restOrganismoEmisorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(organismoEmisor)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCodigoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        organismoEmisor.setCodigo(null);

        // Create the OrganismoEmisor, which fails.

        restOrganismoEmisorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(organismoEmisor)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOrganismoEmisors() throws Exception {
        // Initialize the database
        insertedOrganismoEmisor = organismoEmisorRepository.saveAndFlush(organismoEmisor);

        // Get all the organismoEmisorList
        restOrganismoEmisorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organismoEmisor.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO)));
    }

    @Test
    @Transactional
    void getOrganismoEmisor() throws Exception {
        // Initialize the database
        insertedOrganismoEmisor = organismoEmisorRepository.saveAndFlush(organismoEmisor);

        // Get the organismoEmisor
        restOrganismoEmisorMockMvc
            .perform(get(ENTITY_API_URL_ID, organismoEmisor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organismoEmisor.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO));
    }

    @Test
    @Transactional
    void getNonExistingOrganismoEmisor() throws Exception {
        // Get the organismoEmisor
        restOrganismoEmisorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrganismoEmisor() throws Exception {
        // Initialize the database
        insertedOrganismoEmisor = organismoEmisorRepository.saveAndFlush(organismoEmisor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the organismoEmisor
        OrganismoEmisor updatedOrganismoEmisor = organismoEmisorRepository.findById(organismoEmisor.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOrganismoEmisor are not directly saved in db
        em.detach(updatedOrganismoEmisor);
        updatedOrganismoEmisor.nombre(UPDATED_NOMBRE).codigo(UPDATED_CODIGO);

        restOrganismoEmisorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrganismoEmisor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedOrganismoEmisor))
            )
            .andExpect(status().isOk());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOrganismoEmisorToMatchAllProperties(updatedOrganismoEmisor);
    }

    @Test
    @Transactional
    void putNonExistingOrganismoEmisor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        organismoEmisor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganismoEmisorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, organismoEmisor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(organismoEmisor))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrganismoEmisor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        organismoEmisor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganismoEmisorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(organismoEmisor))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrganismoEmisor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        organismoEmisor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganismoEmisorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(organismoEmisor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrganismoEmisorWithPatch() throws Exception {
        // Initialize the database
        insertedOrganismoEmisor = organismoEmisorRepository.saveAndFlush(organismoEmisor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the organismoEmisor using partial update
        OrganismoEmisor partialUpdatedOrganismoEmisor = new OrganismoEmisor();
        partialUpdatedOrganismoEmisor.setId(organismoEmisor.getId());

        partialUpdatedOrganismoEmisor.nombre(UPDATED_NOMBRE).codigo(UPDATED_CODIGO);

        restOrganismoEmisorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganismoEmisor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrganismoEmisor))
            )
            .andExpect(status().isOk());

        // Validate the OrganismoEmisor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrganismoEmisorUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedOrganismoEmisor, organismoEmisor),
            getPersistedOrganismoEmisor(organismoEmisor)
        );
    }

    @Test
    @Transactional
    void fullUpdateOrganismoEmisorWithPatch() throws Exception {
        // Initialize the database
        insertedOrganismoEmisor = organismoEmisorRepository.saveAndFlush(organismoEmisor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the organismoEmisor using partial update
        OrganismoEmisor partialUpdatedOrganismoEmisor = new OrganismoEmisor();
        partialUpdatedOrganismoEmisor.setId(organismoEmisor.getId());

        partialUpdatedOrganismoEmisor.nombre(UPDATED_NOMBRE).codigo(UPDATED_CODIGO);

        restOrganismoEmisorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganismoEmisor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrganismoEmisor))
            )
            .andExpect(status().isOk());

        // Validate the OrganismoEmisor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrganismoEmisorUpdatableFieldsEquals(
            partialUpdatedOrganismoEmisor,
            getPersistedOrganismoEmisor(partialUpdatedOrganismoEmisor)
        );
    }

    @Test
    @Transactional
    void patchNonExistingOrganismoEmisor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        organismoEmisor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganismoEmisorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, organismoEmisor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(organismoEmisor))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrganismoEmisor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        organismoEmisor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganismoEmisorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(organismoEmisor))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrganismoEmisor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        organismoEmisor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganismoEmisorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(organismoEmisor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganismoEmisor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrganismoEmisor() throws Exception {
        // Initialize the database
        insertedOrganismoEmisor = organismoEmisorRepository.saveAndFlush(organismoEmisor);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the organismoEmisor
        restOrganismoEmisorMockMvc
            .perform(delete(ENTITY_API_URL_ID, organismoEmisor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return organismoEmisorRepository.count();
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

    protected OrganismoEmisor getPersistedOrganismoEmisor(OrganismoEmisor organismoEmisor) {
        return organismoEmisorRepository.findById(organismoEmisor.getId()).orElseThrow();
    }

    protected void assertPersistedOrganismoEmisorToMatchAllProperties(OrganismoEmisor expectedOrganismoEmisor) {
        assertOrganismoEmisorAllPropertiesEquals(expectedOrganismoEmisor, getPersistedOrganismoEmisor(expectedOrganismoEmisor));
    }

    protected void assertPersistedOrganismoEmisorToMatchUpdatableProperties(OrganismoEmisor expectedOrganismoEmisor) {
        assertOrganismoEmisorAllUpdatablePropertiesEquals(expectedOrganismoEmisor, getPersistedOrganismoEmisor(expectedOrganismoEmisor));
    }
}
