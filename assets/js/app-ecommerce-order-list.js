document.addEventListener('DOMContentLoaded', () => {
  const tableElement = document.querySelector('.datatables-order');

  if (!tableElement) {
    return;
  }

  const statusMap = {
    1: { title: 'Pending', class: 'bg-label-warning' },
    2: { title: 'Confirmed', class: 'bg-label-info' },
    3: { title: 'On the way', class: 'bg-label-primary' },
    4: { title: 'Delivered', class: 'bg-label-success' }
  };

  const paymentMap = {
    1: { title: 'Paid', class: 'text-success' },
    2: { title: 'Pending', class: 'text-warning' },
    3: { title: 'Failed', class: 'text-danger' },
    4: { title: 'Refunded', class: 'text-secondary' }
  };

  const dataTable = new DataTable(tableElement, {
    ajax: assetsPath + 'json/ecommerce-customer-order.json',
    columns: [
      { data: 'id' },
      { data: 'id', orderable: false, render: DataTable.render.select() },
      { data: 'order' },
      { data: 'date' },
      { data: 'customer' },
      { data: 'payment' },
      { data: 'status' },
      { data: 'method' },
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
        render: (data, type, row) => `<a href="app-ecommerce-order-details.html"><span>#${row.order}</span></a>`
      },
      {
        targets: 3,
        render: (data, type, row) => {
          const orderDate = new Date(row.date);
          const time = row.time.substring(0, 5);

          return `<span class="text-nowrap">${orderDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}, ${time}</span>`;
        }
      },
      {
        targets: 4,
        responsivePriority: 1,
        render: (data, type, row) => {
          const avatarMarkup = row.avatar
            ? `<img src="${assetsPath}img/avatars/${row.avatar}" alt="${row.customer}" class="rounded-circle">`
            : `<span class="avatar-initial rounded-circle bg-label-primary">${(row.customer.match(/\b\w/g) || [])
                .slice(0, 2)
                .join('')
                .toUpperCase()}</span>`;

          return `
            <div class="d-flex justify-content-start align-items-center order-name text-nowrap">
              <div class="avatar-wrapper">
                <div class="avatar avatar-sm me-3">${avatarMarkup}</div>
              </div>
              <div class="d-flex flex-column">
                <h6 class="m-0"><a href="javascript:void(0);" class="text-heading">${row.customer}</a></h6>
                <small>${row.email}</small>
              </div>
            </div>
          `;
        }
      },
      {
        targets: 5,
        render: (data, type, row) => {
          const payment = paymentMap[row.payment];

          if (!payment) {
            return data;
          }

          return `
            <h6 class="mb-0 align-items-center d-flex w-px-100 ${payment.class}">
              <i class="icon-base ri ri-circle-fill icon-10px me-1"></i>${payment.title}
            </h6>
          `;
        }
      },
      {
        targets: -3,
        render: (data, type, row) => {
          const status = statusMap[row.status];

          if (!status) {
            return data;
          }

          return `
            <span class="badge rounded-pill px-2 ${status.class} text-capitalized">
              ${status.title}
            </span>
          `;
        }
      },
      {
        targets: -2,
        render: (data, type, row) => `
          <div class="d-flex align-items-center text-nowrap">
            <img src="${assetsPath}img/icons/payments/${row.method}.png" alt="${row.method}" class="me-2" width="29">
            <span><i class="icon-base ri ri-more-line mt-1"></i>${row.method_number}</span>
          </div>
        `
      },
      {
        targets: -1,
        title: 'Actions',
        searchable: false,
        orderable: false,
        render: () => `
          <div class="d-flex justify-content-sm-start align-items-sm-center">
            <button class="btn btn-icon btn-text-secondary rounded-pill waves-effect dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <i class="icon-base ri ri-more-2-line icon-22px"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-end m-0">
              <a href="app-ecommerce-order-details.html" class="dropdown-item">View order</a>
              <a href="javascript:void(0);" class="dropdown-item delete-record">Remove row</a>
            </div>
          </div>
        `
      }
    ],
    select: {
      style: 'multi',
      selector: 'td:nth-child(2)'
    },
    order: [3, 'desc'],
    layout: {
      topStart: {
        search: {
          placeholder: 'Search orders',
          text: '_INPUT_'
        }
      },
      topEnd: {
        rowClass: 'row mx-2 my-0 justify-content-between',
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
                className: 'btn btn-outline-secondary dropdown-toggle waves-effect',
                text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-upload-2-line icon-16px me-sm-2"></i> <span class="d-none d-sm-inline-block">Export</span></span>',
                buttons: [
                  {
                    extend: 'print',
                    text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-printer-line me-1"></i>Print</span>',
                    exportOptions: {
                      columns: [2, 3, 4, 5, 6, 7],
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
                      columns: [2, 3, 4, 5, 6, 7],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  },
                  {
                    extend: 'excel',
                    text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-file-excel-line me-1"></i>Excel</span>',
                    exportOptions: {
                      columns: [2, 3, 4, 5, 6, 7],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  },
                  {
                    extend: 'pdf',
                    text: '<span class="d-flex align-items-center"><i class="icon-base ri ri-file-pdf-line me-1"></i>Pdf</span>',
                    exportOptions: {
                      columns: [2, 3, 4, 5, 6, 7],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  },
                  {
                    extend: 'copy',
                    text: '<i class="icon-base ri ri-file-copy-line me-1"></i>Copy',
                    exportOptions: {
                      columns: [2, 3, 4, 5, 6, 7],
                      format: {
                        body: bodyFormatter
                      }
                    }
                  }
                ]
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
          header: row => `Order ${row.data().order}`
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
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.classList.contains('delete-record')) {
      return;
    }

    dataTable.row(event.target.closest('tr')).remove().draw();

    const modal = document.querySelector('.dtr-bs-modal');

    if (modal && modal.classList.contains('show')) {
      bootstrap.Modal.getInstance(modal)?.hide();
    }
  });

  setTimeout(() => {
    [
      { selector: '.dt-buttons .btn', classToRemove: 'btn-secondary', classToAdd: 'btn-outline-secondary' },
      { selector: '.dt-search .form-control', classToAdd: 'ms-0' },
      { selector: '.dt-layout-table', classToRemove: 'row mt-2' },
      { selector: '.dt-layout-end', classToAdd: 'gap-md-2 gap-0 mt-0' },
      { selector: '.dt-layout-end .dt-length', classToAdd: 'mt-md-5 mt-0' },
      { selector: '.dt-layout-start', classToAdd: 'mt-0' },
      { selector: '.dt-layout-end .dt-buttons.btn-group', classToAdd: 'justify-content-center mb-md-0 mb-5' },
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
  const orderName = html.querySelector('.order-name h6');

  if (orderName) {
    return orderName.textContent.trim();
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
