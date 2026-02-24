package es.imserso.sample.monoliticapp1.service;

import es.imserso.sample.monoliticapp1.domain.EnvioMasivo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link es.imserso.sample.monoliticapp1.domain.EnvioMasivo}.
 */
public interface EnvioMasivoService {
    /**
     * Save a envioMasivo.
     *
     * @param envioMasivo the entity to save.
     * @return the persisted entity.
     */
    EnvioMasivo save(EnvioMasivo envioMasivo);

    /**
     * Updates a envioMasivo.
     *
     * @param envioMasivo the entity to update.
     * @return the persisted entity.
     */
    EnvioMasivo update(EnvioMasivo envioMasivo);

    /**
     * Partially updates a envioMasivo.
     *
     * @param envioMasivo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EnvioMasivo> partialUpdate(EnvioMasivo envioMasivo);

    /**
     * Get all the envioMasivos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EnvioMasivo> findAll(Pageable pageable);

    /**
     * Get the "id" envioMasivo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EnvioMasivo> findOne(Long id);

    /**
     * Delete the "id" envioMasivo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
