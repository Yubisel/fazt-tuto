$(function () {

    //Delete element logic
    //--------------------------------------------------------------------------------------
    const $delete_confirm_form = $('#delete-confirm-form');
    const $delete_modal = $('#delete-modal');
    $('body').on('click', '.delete-element', function (e) {
        e.preventDefault();
        $delete_confirm_form.attr('action', $(this).data('url'));
        $delete_modal.modal('show');
    });

    $delete_modal.on('hidden.bs.modal', function (e) {
        $delete_confirm_form.attr('action', '');
    });
    //--------------------------------------------------------------------------------------
});