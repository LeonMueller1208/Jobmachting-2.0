@echo off
cd web
echo Regenerating Prisma client...
npx prisma generate
echo Done! Now restart your dev server with: npm run dev
pause

