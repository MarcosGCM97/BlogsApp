const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createdBlog, sortByLike } = require('./helpers')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Test',
                username: 'Test',
                password: '1234'
            }
        })
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Otro',
                username: 'Otro',
                password: '1234'
            }
        })
        await page.goto('http://localhost:3000/')
    })

    test('user can log in and post a blog', async ({ page }) => {
        await loginWith(page, 'Test', '1234')

        await expect(page.getByText('Test logged-in')).toBeVisible()

        await page.getByTestId('name').fill('otronombre')
        await page.getByTestId('title').fill('otroelnombre')
        await page.getByTestId('url').fill('otronombre.com')

        await page.getByRole('button', { name: 'Add Blog' }).click()
    })
    

    describe('when logged in', () => { 
        beforeEach(async ({ page }) => {
            //se loguea un usuario y crea un blog
            await loginWith(page, 'Test', '1234') 
            await createdBlog(page, 'minombre', 'tuyoelnombre','minonombre.com')

            await page.waitForTimeout(1000)
            await page.getByRole('button', { name: 'Log Out' }).click()    
            
            await loginWith(page, 'Otro', '1234')
        })
    
        test('front page can be opened', async ({ page }) => {
        
            await expect(page.getByText('Comunity Blogs:')).toBeVisible()
        })
    
        test('a new blog can be created', async ({ page }) => {
            
            await page.getByTestId('name').fill('tunombre')
            await page.getByTestId('title').fill('mioelnombre')
            await page.getByTestId('url').fill('tusinombre.com')
    
            await page.getByRole('button', { name: 'Add Blog' }).click()
    
            await expect(page.getByText('mioelnombre')).toBeVisible()
        })

        test('The blog can be modificated', async ({ page }) => {
    
            await expect(page.getByText('tuyoelnombre')).toBeVisible()

            await page.getByText('View').click()
            await page.getByText('0')
            
            await page.getByRole('button', { name: '👍' }).click()
            
            await page.getByText('View').click()
            const locator = await page.getByText('1')
            await expect(locator).toBeVisible()
        })

        test('Delete a Blog', async ({ page }) => {
            await createdBlog(page, 'detodoses', 'detodoselnombre','esdetodos.com')
            await page.waitForTimeout(500)
            
            await page.on('dialog', async dialog => {
                expect(dialog.type()).toBe('confirm')
                await dialog.accept()
            })
            await page.getByText('❌').last().click()

            await page.waitForTimeout(1000)
            
            const blogElement = await page.$('text=detodoselnombre');
            expect(blogElement).toBeNull();
        })

        test.only('the logged user can not delete a blog of other user', async ({ page }) => {

            await page.getByRole('button', ({ name: '❌' })).click()

            await page.waitForTimeout(500)
            const message = await page.getByText('you can not delete this blog')
            expect(message).toBeVisible()
        })

        test('Sort by likes', async ({ page }) => {
            await createdBlog(page, 'otronombre', 'otroelnombre','otronombre.com')
            
            await sortByLike(page)
            await page.waitForTimeout(1000)
            const locator = page.getByTestId('blog')

            await locator.first().getByRole('button', ({ name: 'View' })).click()
            await locator.last().getByRole('button', ({ name: 'View' })).click()

            const elementos = await page.$$eval('.pLike', elementos => elementos.map(el => el.textContent));

            const valor1 = Number(elementos[0]);
            const valor2 = Number(elementos[1]);

            expect(valor1).toBeGreaterThan(valor2)
        })  
    })
})