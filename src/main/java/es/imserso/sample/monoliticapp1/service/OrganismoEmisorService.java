package es.imserso.sample.monoliticapp1.service;

import es.imserso.sample.monoliticapp1.domain.OrganismoEmisor;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link es.imserso.sample.monoliticapp1.domain.OrganismoEmisor}.
 */
public interface OrganismoEmisorService {
    /**
     * Save a organismoEmisor.
     *
     * @param organismoEmisor the entity to save.
     * @return the persisted entity.
     */
    OrganismoEmisor save(OrganismoEmisor organismoEmisor);

    /**
     * Updates a organismoEmisor.
     *
     * @param organismoEmisor the entity to update.
     * @return the persisted entity.
     */
    OrganismoEmisor update(OrganismoEmisor organismoEmisor);

    /**
     * Partially updates a organismoEmisor.
     *
     * @param organismoEmisor the entity to update partially.
     * @return the persisted entity.
     */
    Optional<OrganismoEmisor> partialUpdate(OrganismoEmisor organismoEmisor);

    /**
     * Get all the organismoEmisors.
     *
     * @return the list of entities.
     */
    List<OrganismoEmisor> findAll();

    /**
     * Get the "id" organismoEmisor.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OrganismoEmisor> findOne(Long id);

    /**
     * Delete the "id" organismoEmisor.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
