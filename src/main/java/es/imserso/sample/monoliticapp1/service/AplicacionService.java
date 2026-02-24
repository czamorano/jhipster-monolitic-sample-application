package es.imserso.sample.monoliticapp1.service;

import es.imserso.sample.monoliticapp1.domain.Aplicacion;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link es.imserso.sample.monoliticapp1.domain.Aplicacion}.
 */
public interface AplicacionService {
    /**
     * Save a aplicacion.
     *
     * @param aplicacion the entity to save.
     * @return the persisted entity.
     */
    Aplicacion save(Aplicacion aplicacion);

    /**
     * Updates a aplicacion.
     *
     * @param aplicacion the entity to update.
     * @return the persisted entity.
     */
    Aplicacion update(Aplicacion aplicacion);

    /**
     * Partially updates a aplicacion.
     *
     * @param aplicacion the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Aplicacion> partialUpdate(Aplicacion aplicacion);

    /**
     * Get all the aplicacions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Aplicacion> findAll(Pageable pageable);

    /**
     * Get the "id" aplicacion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Aplicacion> findOne(Long id);

    /**
     * Delete the "id" aplicacion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
