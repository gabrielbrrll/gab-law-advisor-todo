-- AlterTable
CREATE SEQUENCE todo_order_seq;
ALTER TABLE "Todo" ALTER COLUMN "order" SET DEFAULT nextval('todo_order_seq');
ALTER SEQUENCE todo_order_seq OWNED BY "Todo"."order";
