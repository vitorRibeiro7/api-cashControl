import { Router, Request, Response } from "express";
import * as Yup from "yup";
import { prisma } from "../../lib/prisma";

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  const createTransactionSchema = Yup.object({
    description: Yup.string()
      .typeError("Tipo de descrição invalido.")
      .required(),
    price: Yup.number()
      .typeError("Tipo de preço invalido.")
      .required()
      .positive("O numero precisa ser positivo."),
    categoty: Yup.string(),
    type: Yup.boolean().required(),
  });

  try {
    createTransactionSchema.validateSync(req.body);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        ...req.body,
      },
    });

    return res.status(201).json(transaction);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
});

// transaction?limit=10&page=1
router.get("/", async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;

  const transactions = await prisma.transaction.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return res.status(200).json(transactions);
});

router.get("/amount", async (req: Request, res: Response) => {
  const deposit = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      type: true,
    },
    _sum: {
      price: true,
    },
  });

  const withdraw = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      type: false,
    },
    _sum: {
      price: true,
    },
  });

  const totalDeposit = deposit[0]._sum.price ?? 0;
  const totalWithdraw = withdraw[0]._sum.price ?? 0;
  const total = totalDeposit + totalWithdraw;

  return res.status(200).json({ totalDeposit, totalWithdraw, total });
});

export default router;
