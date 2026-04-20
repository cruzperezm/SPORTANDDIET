const user = await prisma.user.findUnique({
    where: { id: 1 },
    select: { username: true }
});

res.json(user);