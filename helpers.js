
const loginWith = async (page, username, password)  => {

    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
}

const createdBlog = async (page, name, title, url) => {
    
    await page.getByTestId('name').fill(name)
    await page.getByTestId('title').fill(title)
    await page.getByTestId('url').fill(url)

    await page.getByRole('button', { name: 'Add Blog' }).click()
}

const sortByLike = async (page) => {
    await page.getByRole('button', ({ name: 'View' })).first().click()
    await page.getByRole('button', ({ name: '👍' })).click()
    
    await page.getByRole('button', ({ name: 'View' })).last().click()
    await page.getByRole('button', ({ name: '👍' })).click()

    await page.getByRole('button', ({ name: 'View' })).last().click()
    await page.getByRole('button', ({ name: '👍' })).click()
}
  
  export { loginWith, createdBlog, sortByLike }