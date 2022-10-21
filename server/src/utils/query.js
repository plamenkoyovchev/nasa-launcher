const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function getPagination(query) {
    const page = query?.page || DEFAULT_PAGE;
    const limit = query?.limit || DEFAULT_LIMIT;

    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    };
}

module.exports = {
    getPagination,
};