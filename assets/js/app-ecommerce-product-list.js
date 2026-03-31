document.addEventListener('DOMContentLoaded', () => {
  const tableElement = document.querySelector('.datatables-products');

  if (!tableElement) {
    return;
  }

  const statusMap = {
    1: { title: 'Draft', class: 'bg-label-warning' },
    2: { title: 'Published', class: 'bg-label-success' },
    3: { title: 'Archived', class: 'bg-label-secondary' }
  };

  const categoryMap = {
    0: { title: 'Electronics', icon: 'ri-smartphone-line', color: 'primary' },
    1: { title: 'Fashion', icon: 'ri-t-shirt-line', color: 'info' },
    2: { title: 'Home', icon: 'ri-home-6-line', color: 'warning' },
    3: { title: 'Beauty', icon: 'ri-heart-3-line', color: 'danger' },
    4: { title: 'Accessories', icon: 'ri-handbag-line', color: 'secondary' },
    5: { title: 'Office', icon: 'ri-briefcase-line', color: 'success' }
  };

  const stockMap = {
    0: { title: 'Out of stock' },
    1: { title: 'In stock' }
  };

  new DataTable(tableElement, {
    ajax: assetsPath + 'json/ecommerce-product-list.json',
    columns: [
      { data: 'id' },
      { data: 'id', orderable: false, render: DataTable.render.select() },
      { data: 'product_name' },
      { data: 'category' },
      { data: 'stock' },
      { data: 'sku' },
      { data: 'price' },
      { data: 'qty' },
      { data: 'status' },
      { data: 'id' }
    ],
    columnDefs: [
      {
        className: 'control',
        searchable: false,
        orderable: false,
        responsivePriority: 2,
        targets: 0,
        render: () => ''
      },
      {
        targets: 1,
        orderable: false,
        searchable: false,
        responsivePriority: 3,
        checkboxes: true,
        checkboxes: {
          selectAllRender: '<input type="checkbox" class="form-check-input">'
        },
        render: () => '<input type="checkbox" class="dt-checkboxes form-check-input">'
      },
      {
        targets: 2,
        responsivePriority: 1,
        render: (data, type, row) => {
          if (type !== 'display') {
            return row.product_name;
          }

          const imageMarkup = row.image
            ? `<img src="${assetsPath}img/products/${row.image}" alt="${row.product_name}" class="rounded">`
            : `<span class="avatar-initial rounded-2 bg-label-primary">${(row.product_brand.match(/\b\w/g) || [])
                .slice(0, 2)
                .join('')
                .toUpperCase()}</span>`;

          return `
            <div class="d-flex justify-content-start align-items-center product-name">
              <div class="avatar-wrapper">
                <div class="avatar avatar me-2 me-sm-4 rounded-2 bg-label-secondary">${imageMarkup}</div>
              </div>
              <div class="d-flex flex-column">
                <h6 class="text-nowrap mb-0">${row.product_name}</h6>
                <small class="text-truncate d-none d-sm-block">${row.product_brand}</small>
              </div>
            </div>
          `;
        }
      },
      {
        targets: 3,
        responsivePriority: 5,
        render: (data, type, row) => {
          const category = categoryMap[row.category];

          if (!category) {
            return data;
          }

          if (type !== 'display') {
            return category.title;
          }

          return `
            <span class="text-truncate d-flex align-items-center text-heading">
              <span class="w-px-30 h-px-30 rounded-circle d-flex justify-content-center align-items-center bg-label-${category.color} me-3">
                <i class="icon-base ri ${category.icon} icon-18px"></i>
              </span>
              ${category.title}
            </span>
          `;
        }
      },
      {
        targets: 4,
        orderable: false,
        responsivePriority: 3,
        render: (data, type, row) => {
          const stock = stockMap[row.stock];

          if (!stock) {
            return data;
          }

          if (type !== 'display') {
            return stock.title;
          }

          return `
            <span class="text-truncate d-flex align-items-center gap-3">
              <label class="switch switch-primary switch-sm mb-0">
                <input type="checkbox" class="switch-input" ${row.stock ? 'checked' : ''}>
                <span class="switch-toggle-slider">
                  <span class="switch-on"></span>
                  <span class="switch-off"></span>
                </span>
              </label>
              <span>${stock.title}</span>
            </span>
          `;
        }
      },
      {
        targets: 5,
        render: (data, type, row) => `<span>${row.sku}</span>`
      },
      {
        targets: 6,
        render: (data, type, row) => `<span>${row.price}</span>`
      },
      {
        targets: 7,
        responsivePriority: 4,
        render: (data, type, row) => `<span>${row.qty}</span>`
      },
      {
        targets: -2,
        render: (data, type, row) => {
          const status = statusMap[row.status];
          return `<span class="badge rounded-pill ${status.class} text-capitalized">${status.title}</span>`;
        }
      },
      {
        targets: -1,
        title: 'Actions',
        searchable: false,
        orderable: false,
        render: () => `
          <div class="d-inline-block text-nowrap">
            <button class="btn btn-icon btn-text-secondary rounded-pill waves-effect">
              <i class="icon-base ri ri-edit-box-line icon-22px"></i>
            </button>
            <button class="btn btn-icon btn-text-secondary rounded-pill waves-effect dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <i class="icon-base ri ri-more-2-line icon-22px"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end m-0">
              <a href="javascript:void(0);" class="dropdown-item">View listing</a>
              <a href="javascript:void(0);" class="dropdown-item">Duplicate</a>
              <a href="javascript:void(0);" class="dropdown-item">Archive</a>
            </div>
          </div>
        `
      }
    ],
    select: {
      style: 'multi',
      selector: 'td:nth-child(2)'
    },
    order: [2, 'asc'],
    layout: {
      topStart: {
        rowClass:
          'card-header d-flex border-top rounded-0 flex-wrap py-0 flex-column flex-md-row align-items-start',
        features: [
          {
            search: {
              className: 'me-5 ms-n4 pe-5 mb-n6 mb-md-0',
              placeholder: 'Search products',
              text: '_INPUT_'
            }
          }
        ]
      },
      topEnd: {
        rowClass: 'row m-3 mx-2 my-0 justify-content-between',
        features: [
          {
            pageLength: {
              menu: [7, 10, 25, 50, 100],
              text: '_MENU_'
            }
          },
          {
            buttons: [
              {
                extend: 'collection',
                className: 'btn btn-outline-secondary dropdown-toggle me-4 waves-effect',
                text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-upload-2-line icon-16px me-sm-1"></i> <span class="d-none d-sm-inline-block">Export</span></span>',
                buttons: [
                  {
                    extend: 'print',
                    text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-printer-line me-1"></i>Print</span>',
                    exportOptions: {
                      columns: [2, 3, 5, 6, 7, 8],
                      format: {
                        body: bodyFormatter
                      }
                    },
                    customize: customizeExport
                  },
                  {
                    extend: 'csv',
                    text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-file-text-line me-1"></i>Csv</span>',
                    exportOptions: {
                      columns: [2, 3, 5, 6, 7, 8],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  },
                  {
                    extend: 'excel',
                    text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-file-excel-line me-1"></i>Excel</span>',
                    exportOptions: {
                      columns: [2, 3, 5, 6, 7, 8],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  },
                  {
                    extend: 'pdf',
                    text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-file-pdf-line me-1"></i>Pdf</span>',
                    exportOptions: {
                      columns: [2, 3, 5, 6, 7, 8],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  },
                  {
                    extend: 'copy',
                    text: '<i class="icon-base ri ri-file-copy-line me-1"></i>Copy',
                    exportOptions: {
                      columns: [2, 3, 5, 6, 7, 8],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  }
                ]
              },
              {
                text: '<i class="icon-base ri ri-add-line me-0 me-sm-1 icon-16px"></i><span class="d-none d-sm-inline-block">Add New Product</span>',
                className: 'add-new btn btn-primary',
                action: () => {
                  window.location.href = 'app-ecommerce-product-add.html';
                }
              }
            ]
          }
        ]
      },
      bottomStart: {
        rowClass: 'row mx-3 justify-content-between',
        features: ['info']
      },
      bottomEnd: 'paging'
    },
    displayLength: 7,
    language: {
      paginate: {
        next: '<i class="icon-base ri ri-arrow-right-s-line scaleX-n1-rtl icon-22px"></i>',
        previous: '<i class="icon-base ri ri-arrow-left-s-line scaleX-n1-rtl icon-22px"></i>',
        first: '<i class="icon-base ri ri-skip-back-mini-line scaleX-n1-rtl icon-22px"></i>',
        last: '<i class="icon-base ri ri-skip-forward-mini-line scaleX-n1-rtl icon-22px"></i>'
      }
    },
    responsive: {
      details: {
        display: DataTable.Responsive.display.modal({
          header: row => `Details of ${row.data().product_name}`
        }),
        type: 'column',
        renderer: (api, rowIdx, columns) => {
          const rows = columns
            .map(
              column =>
                column.title !== ''
                  ? `<tr data-dt-row="${column.rowIndex}" data-dt-column="${column.columnIndex}">
                       <td>${column.title}:</td>
                       <td>${column.data}</td>
                     </tr>`
                  : ''
            )
            .join('');

          if (!rows) {
            return false;
          }

          const wrapper = document.createElement('div');
          const table = document.createElement('table');
          const tbody = document.createElement('tbody');

          wrapper.classList.add('table-responsive');
          table.classList.add('table');
          tbody.innerHTML = rows;
          table.appendChild(tbody);
          wrapper.appendChild(table);

          return wrapper;
        }
      }
    },
    initComplete: function () {
      const api = this.api();

      api.columns(-2).every(function () {
        const column = this;
        const select = document.createElement('select');

        select.id = 'ProductStatus';
        select.className = 'form-select text-capitalize';
        select.innerHTML = '<option value="">Product status</option>';

        document.querySelector('.product_status').appendChild(select);

        select.addEventListener('change', () => {
          const value = select.value ? `^${select.value}$` : '';
          column.search(value, true, false).draw();
        });

        column
          .data()
          .unique()
          .sort()
          .each(value => {
            const option = document.createElement('option');
            option.value = statusMap[value].title;
            option.textContent = statusMap[value].title;
            select.appendChild(option);
          });
      });

      api.columns(3).every(function () {
        const column = this;
        const select = document.createElement('select');

        select.id = 'ProductCategory';
        select.className = 'form-select text-capitalize';
        select.innerHTML = '<option value="">Category</option>';

        document.querySelector('.product_category').appendChild(select);

        select.addEventListener('change', () => {
          const value = select.value ? `^${select.value}$` : '';
          column.search(value, true, false).draw();
        });

        column
          .data()
          .unique()
          .sort()
          .each(value => {
            const option = document.createElement('option');
            option.value = categoryMap[value].title;
            option.textContent = categoryMap[value].title;
            select.appendChild(option);
          });
      });

      api.columns(4).every(function () {
        const column = this;
        const select = document.createElement('select');

        select.id = 'ProductStock';
        select.className = 'form-select text-capitalize';
        select.innerHTML = '<option value="">Stock</option>';

        document.querySelector('.product_stock').appendChild(select);

        select.addEventListener('change', () => {
          const value = select.value ? `^${select.value}$` : '';
          column.search(value, true, false).draw();
        });

        column
          .data()
          .unique()
          .sort()
          .each(value => {
            const option = document.createElement('option');
            option.value = stockMap[value].title;
            option.textContent = stockMap[value].title;
            select.appendChild(option);
          });
      });
    }
  });

  setTimeout(() => {
    [
      { selector: '.dt-buttons .btn', classToRemove: 'btn-secondary' },
      { selector: '.dt-search .form-control', classToAdd: 'ms-0' },
      { selector: '.dt-search', classToAdd: 'mb-0 mb-md-5' },
      { selector: '.dt-layout-table', classToRemove: 'row mt-2' },
      { selector: '.dt-layout-end', classToAdd: 'gap-md-2 gap-0 mt-0' },
      { selector: '.dt-layout-start', classToAdd: 'mt-0' },
      { selector: '.dt-layout-end .dt-buttons.btn-group', classToAdd: 'mb-md-0 mb-5' },
      { selector: '.dt-layout-full', classToRemove: 'col-md col-12', classToAdd: 'table-responsive' }
    ].forEach(({ selector, classToRemove, classToAdd }) => {
      document.querySelectorAll(selector).forEach(element => {
        if (classToRemove) {
          classToRemove.split(' ').forEach(className => element.classList.remove(className));
        }

        if (classToAdd) {
          classToAdd.split(' ').forEach(className => element.classList.add(className));
        }
      });
    });
  }, 100);
});

function bodyFormatter(value) {
  if (!value || !value.includes('<')) {
    return value;
  }

  const html = new DOMParser().parseFromString(value, 'text/html');
  const productName = html.querySelector('.product-name h6');

  if (productName) {
    return productName.textContent.trim();
  }

  return (html.body.textContent || html.body.innerText || '').trim();
}

function customizeExport(windowRef) {
  windowRef.document.body.style.color = config.colors.headingColor;
  windowRef.document.body.style.borderColor = config.colors.borderColor;
  windowRef.document.body.style.backgroundColor = config.colors.bodyBg;

  const table = windowRef.document.body.querySelector('table');

  if (table) {
    table.classList.add('compact');
    table.style.color = 'inherit';
    table.style.borderColor = 'inherit';
    table.style.backgroundColor = 'inherit';
  }
}
