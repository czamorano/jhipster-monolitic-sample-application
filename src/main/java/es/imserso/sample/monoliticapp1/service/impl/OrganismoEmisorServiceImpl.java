package es.imserso.sample.monoliticapp1.service.impl;

import es.imserso.sample.monoliticapp1.domain.OrganismoEmisor;
import es.imserso.sample.monoliticapp1.repository.OrganismoEmisorRepository;
import es.imserso.sample.monoliticapp1.service.OrganismoEmisorService;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link es.imserso.sample.monoliticapp1.domain.OrganismoEmisor}.
 */
@Service
@Transactional
public class OrganismoEmisorServiceImpl implements OrganismoEmisorService {

    private static final Logger LOG = LoggerFactory.getLogger(OrganismoEmisorServiceImpl.class);

    private final OrganismoEmisorRepository organismoEmisorRepository;

    public OrganismoEmisorServiceImpl(OrganismoEmisorRepository organismoEmisorRepository) {
        this.organismoEmisorRepository = organismoEmisorRepository;
    }

    @Override
    public OrganismoEmisor save(OrganismoEmisor organismoEmisor) {
        LOG.debug("Request to save OrganismoEmisor : {}", organismoEmisor);
        return organismoEmisorRepository.save(organismoEmisor);
    }

    @Override
    public OrganismoEmisor update(OrganismoEmisor organismoEmisor) {
        LOG.debug("Request to update OrganismoEmisor : {}", organismoEmisor);
        return organismoEmisorRepository.save(organismoEmisor);
    }

    @Override
    public Optional<OrganismoEmisor> partialUpdate(OrganismoEmisor organismoEmisor) {
        LOG.debug("Request to partially update OrganismoEmisor : {}", organismoEmisor);

        return organismoEmisorRepository
            .findById(organismoEmisor.getId())
            .map(existingOrganismoEmisor -> {
                updateIfPresent(existingOrganismoEmisor::setNombre, organismoEmisor.getNombre());
                updateIfPresent(existingOrganismoEmisor::setCodigo, organismoEmisor.getCodigo());

                return existingOrganismoEmisor;
            })
            .map(organismoEmisorRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrganismoEmisor> findAll() {
        LOG.debug("Request to get all OrganismoEmisors");
        return organismoEmisorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganismoEmisor> findOne(Long id) {
        LOG.debug("Request to get OrganismoEmisor : {}", id);
        return organismoEmisorRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete OrganismoEmisor : {}", id);
        organismoEmisorRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
