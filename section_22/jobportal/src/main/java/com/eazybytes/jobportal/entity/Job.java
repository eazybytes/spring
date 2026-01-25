package com.eazybytes.jobportal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "jobs")
public class Job extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Size(max = 255)
    @NotNull
    @Column(name = "location", nullable = false)
    private String location;

    @Size(max = 50)
    @NotNull
    @Column(name = "work_type", nullable = false, length = 50)
    private String workType;

    @Size(max = 50)
    @NotNull
    @Column(name = "job_type", nullable = false, length = 50)
    private String jobType;

    @Size(max = 100)
    @NotNull
    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Size(max = 50)
    @NotNull
    @Column(name = "experience_level", nullable = false, length = 50)
    private String experienceLevel;

    @NotNull
    @Column(name = "salary_min", nullable = false, precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @NotNull
    @Column(name = "salary_max", nullable = false, precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Size(max = 10)
    @NotNull
    @ColumnDefault("'USD'")
    @Column(name = "salary_currency", nullable = false, length = 10)
    private String salaryCurrency;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'year'")
    @Column(name = "salary_period", nullable = false, length = 20)
    private String salaryPeriod;

    @NotNull
    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Lob
    @Column(name = "requirements")
    private String requirements;

    @Lob
    @Column(name = "benefits")
    private String benefits;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "posted_date", nullable = false)
    private Instant postedDate;

    @Column(name = "application_deadline")
    private Instant applicationDeadline;

    @ColumnDefault("0")
    @Column(name = "applications_count")
    private Integer applicationsCount;

    @ColumnDefault("0")
    @Column(name = "featured")
    private Boolean featured;

    @ColumnDefault("0")
    @Column(name = "urgent")
    private Boolean urgent;

    @ColumnDefault("0")
    @Column(name = "remote")
    private Boolean remote;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'ACTIVE'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @ManyToMany(mappedBy = "savedJobs")
    private Set<JobPortalUser> savedByUsers = new LinkedHashSet<>();

    @OneToMany(mappedBy = "job")
    private Set<JobApplication> jobApplications = new LinkedHashSet<>();

}