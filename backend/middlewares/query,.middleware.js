import z from "zod";


const querySchema = z.object({
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    isFeatured: z.coerce.boolean().optional()
});

export const validateQuery = (req, res, next) => {
    try {
        querySchema.parse(req.query);
        next();
    } catch (error) {
        next(error);
    }
};