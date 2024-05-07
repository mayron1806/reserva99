import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.company.create({
    data: {
      identifier: 'olamundo',
      name: 'teste',
      gatewaySubscriptionStatus: 'new',
      cashFlow: {
        create: {}
      },
      address: {
        create: {
          city: 'Sete Lagoas',
          country: 'Brasil',
          district: 'Carmo',
          number: '299',
          state: 'Minas Gerais',
          street: 'Crisantemo',
          zipCode: '35700466',
          complement: ''
        }
      },
      times: {
        create: {
          friday: '[{"end":"12:00","start":"08:00"},{"end":"18:00","start":"13:00"}]',
          monday: '[{"end":"12:00","start":"08:00"},{"end":"18:00","start":"13:00"}]',
          saturday: '[{"end":"12:00","start":"08:00"},{"end":"18:00","start":"13:00"}]',
          sunday: '[{"end":"12:00","start":"08:00"},{"end":"18:00","start":"13:00"}]',
          thursday: '[{"end":"12:00","start":"08:00"},{"end":"18:00","start":"13:00"}]',
          tuesday: '[{"end":"12:00","start":"08:00"},{"end":"18:00","start":"13:00"}]',
          wednesday: '[{"end":"12:00","start":"08:00"},{"end":"18:00","start":"13:00"}]',
        },
      },
      services: {
        create: {
          name: 'Exame',
          description: 'Desc',
          allowClientReserve: true,
          variants: {
            createMany: {
              data: [
                {
                  name: 'Exame 1',
                  description: 'desc',
                  duration: 2400,
                  price: 5000
                },
                {
                  name: 'Exame 2',
                  description: 'desc',
                  duration: 2400,
                  price: 5000
                },
              ],
            },
          },
        },
      },
      users: {
        create: {
          user: {
            create: {
              nick: 'test',
              password: '$2b$10$k3bVpURx4a/CAiqwl9wZGOlB.dWrAYqkdgtYTFSIuhVIlalpwZHzq',
              email: 'mayron.g.fernandes@gmail.com',
              status: 'Active',
            }
          },
          role: 'admin'
        }
      }
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })