import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension((client) => {
    return client.$extends({
        name: 'soft-delete',
        query: {
            user: {
                async delete({ args }) {
                    return (client as any).user.update({
                        where: args.where,
                        data: { deletedAt: new Date() },
                    });
                },
                async deleteMany({ args }) {
                    return (client as any).user.updateMany({
                        where: args.where,
                        data: { deletedAt: new Date() },
                    });
                },
                async count({ args, query }) {
                    args.where = { deletedAt: null, ...args.where };
                    return query(args);
                },
                async findFirst({ args, query }) {
                    args.where = { deletedAt: null, ...args.where };
                    return query(args);
                },
                async findMany({ args, query }) {
                    args.where = { deletedAt: null, ...args.where };
                    return query(args);
                },
                async findUnique({ args, query }) {
                    return query({
                        ...args,
                        where: { ...args.where, deletedAt: null },
                    });
                },
            },
        },
    });
});
