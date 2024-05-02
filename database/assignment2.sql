-- 1. 
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password) 
VALUES
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2
UPDATE 
	public.account
SET	
	account_type = 'admin'
WHERE
	account_id = 1;