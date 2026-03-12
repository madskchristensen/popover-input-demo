import { faker } from '@faker-js/faker'
import { DeepPartial } from 'typeorm'
import { JobApplication } from 'src/domain/job/application/entities/job-application.entity'
import { ApplicationStatus } from 'src/domain/job/enums/application-status'

const APPLICATION_STATUSES = Object.values(ApplicationStatus)

export function generateJobApplication(
  jobRoleId: string,
  overrides?: DeepPartial<JobApplication>,
): DeepPartial<JobApplication> {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    country: faker.location.countryCode('alpha-2'),
    status: faker.helpers.arrayElement(APPLICATION_STATUSES),
    jobRoleId,
    ...overrides,
  }
}
