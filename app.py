import pymysql as pymysql
from flask import *

app = Flask(__name__)
app.secret_key = "jjciewoh89f34902i0__0302i302i02kedc"


def check_admin():
    if 'role' in session:
        role = session['role']  # get the current role
        if role == 'admin':
            return True
        else:
            return False
    else:
        return False


# other functions
@app.route('/adminlogin', methods=['POST', 'GET'])
def adminlogin():
    if request.method == 'POST':
        first_name = request.form['first_name']
        password = request.form['password']

        # connecting to the database

        con = pymysql.connect(host='localhost', user='root', password='', database='api')
        sql = "select * from admin where first_name = %s"
        # cannot use sql injection
        cursor = con.cursor()
        cursor.execute(sql, first_name)

        # check rows returned
        if cursor.rowcount == 0:
            return render_template('/admin/login.html', message="first name does not exist")
        else:
            row = cursor.fetchone()
            # password is index 5, email index 8 ,phone index 9

            from functions import verify_password, send_sms, send_email, otp_gen
            status = verify_password(row[7], password)
            if status:
                otp = otp_gen()  # random how to do it
                message = "Hi {}, Your OTP is {}".format(first_name, otp)
                # send_email(row[8], 'Login Activity', message)
                send_sms(row[9], message)

                # store the OTP in your db int the current user row
                # first_name. otp
                sql2 = "update admin SET otp = %s where first_name = %s"
                cursor2 = con.cursor()
                cursor2.execute(sql2, (otp, first_name))
                con.commit()
                # we need to carry the current first_name as we go to verify otp
                session['key'] = first_name  # we put name as session key
                # we are done with step1, we go to step 2
                return redirect('/verifyotp')  # navigate to dashboard
            else:
                return render_template('/admin/login.html', message="Password is wrong")
    else:
        return render_template('/admin/login.html')


@app.route('/verifyotp', methods=['POST', 'GET'])
def verifyotp():
    if 'key' in session:
        if request.method == 'POST':
            first_name = session['key']  # retrieve the first name from session key
            otp = request.form['otp']  # retrieve otp sent from the form
            if len(otp) == 6:
                sql = 'select * from admin where otp = %s and first_name = %s'
                con = pymysql.connect(host='localhost', user='root', password='', database='api')
                cursor = con.cursor()
                cursor.execute(sql, (otp, first_name))
                if cursor.rowcount == 0:

                    return render_template('/admin/verifyotp.html', message="Invalid OTP")
                else:
                    # we kill the session from step 1
                    session.pop('key', None)
                    # proceed to dashboard
                    # What is the admin role?
                    sql = "select * from admin where first_name = %s"
                    cursor2 = con.cursor()
                    cursor2.execute(sql, (first_name))
                    row = cursor2.fetchone()
                    # role is at position 6
                    role = row[6]
                    user_id = row[0]
                    # set two sessions for first_name and role
                    session['first_name'] = first_name
                    session['role'] = role
                    session['user_id'] = user_id  # we put user_id in session

                    return redirect('/')  # go to dashboard
            else:
                return render_template('/admin/verifyotp.html', message="Invalid OTP. Muct be 6 characters")
        else:
            return render_template('/admin/verifyotp.html')  # this show the user the verification form
    else:
        return redirect('/adminlogin')


@app.route('/')
def home():
    if check_admin():
        return render_template('index.html')
    else:
        return redirect('/adminlogin')


@app.route('/logout')
def logout():
    session.clear()
    flash("You have logged out successfully!", "info")
    return redirect('/adminlogin')


@app.route('/orders', methods=['POST', 'GET'])
def orders():
    if check_admin():
        if request.method == 'POST':
            code = request.form['code']
            con = pymysql.connect(host='localhost', user='root', password='', database='api')
            sql = "select * from orders where code = %s"
            cursor = con.cursor()
            cursor.execute(sql, (code))
            if cursor.rowcount == 0:
                return render_template('/admin/orders.html', message="Code Does not exist check and try again")
            else:
                row = cursor.fetchall()
                return render_template('/admin/orders.html', rows=row)  # rows is the key carrying the data

        else:
            list = []
            con = pymysql.connect(host='localhost', user='root', password='', database='api')
            sql = "select distinct code from orders"
            cursor = con.cursor()
            cursor.execute(sql)
            if cursor.rowcount == 0:
                return render_template('/admin/orders.html', message="No orders. Enroll more orders")
            else:
                rows = cursor.fetchall()
                for row in rows:
                    sql2 = "select * from orders where code= %s"
                    cursor2 = con.cursor()
                    cursor2.execute(sql2, (row[0]))
                    rows = cursor2.fetchall()  # we get products with that code row[0]
                    list.append(rows)

                print(list)
                return render_template('/admin/orders.html', list=list)

    else:
        return redirect('/adminlogin')


@app.route('/approve_order/<code>')
def approve_order(code):
    if check_admin():
        con = pymysql.connect(host='localhost', user='root', password='', database='api')
        sql = "update orders set status = %s where code = %s"
        cursor = con.cursor()
        cursor.execute(sql, ('approved', code))
        con.commit()
        flash("Order Approved", "success")
        # query using code from orders table and get user_id

        sql1 = 'select * from orders where code = %s'
        con = pymysql.connect(host='localhost', user='root', password='', database='api')
        cursor1 = con.cursor()
        cursor1.execute(sql1, code)
        row1 = cursor1.fetchall()
        print(type(row1))
        print("row1", row1)

        for order in row1:
            # print("orders", order)
            # print(order[1])

            sql2 = 'select * from users where user_id = %s'
            con = pymysql.connect(host='localhost', user='root', password='', database='api')
            cursor2 = con.cursor()
            cursor2.execute(sql2, order[1])
            row2 = cursor2.fetchone()
        # print(type(row2))
        # print("row2: ", row2)

        message = "Dear, {} {}, You're order {} has been '{}' ".format(row2[1], row2[2],
                                                                       order[0],
                                                                       order[6])

        from functions import send_sms, send_email
        send_sms(row2[4], message)

        # query again the users using user_id above
        # get the phone no. or email
        # send sms or email
        return redirect('/orders')

    else:
        return redirect('/adminlogin')


# decline order
@app.route('/decline_order/<code>')
def decline_order(code):
    if check_admin():
        con = pymysql.connect(host='localhost', user='root', password='', database='api')
        sql = "update orders set status = %s where code = %s"
        cursor = con.cursor()
        cursor.execute(sql, ('declined', code))
        con.commit()
        flash("Order Declined", "success")
        # query using code from orders table and get user_id
        # query again the users using user_id above
        # get the phone no. or email
        # send sms or email

        sql1 = 'select * from orders where code = %s'
        con = pymysql.connect(host='localhost', user='root', password='', database='api')
        cursor1 = con.cursor()
        cursor1.execute(sql1, code)
        row1 = cursor1.fetchall()
        # print(type(row1))
        # print("row1", row1)

        for order in row1:
            # print("orders", order)
            # print(order[1])

            sql2 = 'select * from users where user_id = %s'
            con = pymysql.connect(host='localhost', user='root', password='', database='api')
            cursor2 = con.cursor()
            cursor2.execute(sql2, order[1])
            row2 = cursor2.fetchone()
        # print(type(row2))
        # print("row2: ", row2)

        message = "Dear, {} {}, You're order {} has been '{}' ".format(row2[1], row2[2],
                                                                       order[0],
                                                                       order[6])

        from functions import send_sms, send_email
        send_sms(row2[4], message)
        return redirect('/orders')

    else:
        return redirect('/adminlogin')


# profile route
@app.route('/profile')
def profile():
    if 'user_id' in session:
        user_id = session['user_id']  # pull user id from logged in session

        sql = "select * from admin where user_id = %s "
        con = pymysql.connect(host='localhost', user='root', password='', database='api')
        cursor = con.cursor()
        cursor.execute(sql, user_id)
        row = cursor.fetchone()
        #   print(row)
        return render_template('/admin/profile.html', row=row)

    else:
        return redirect('/adminlogin')


@app.route('/changepassword', methods=['POST', 'GET'])
def changepassword():
    if 'user_id' in session:
        if request.method == 'POST':
            current = request.form['current']

            con = pymysql.connect(host='localhost', user='root', password='', database='api')
            user_id = session['user_id']  # get user_id from session
            sql = "select * from admin where user_id = %s"
            cursor = con.cursor()
            cursor.execute(sql, user_id)
            row = cursor.fetchone()
            from functions import verify_password, hash_password
            # check if row[7] is the same aws user provided current password
            status = verify_password(row[7], current)
            if not status:  # not the password that is in the database
                # if status== False:
                return jsonify({'error': 'Current Password is Wrong'})
            else:
                new1 = request.form['new1']
                confirm = request.form['confirm']
                if new1 != confirm:
                    return jsonify({'error': 'Passwords do not match'})
                elif len(new1) < 8:
                    return jsonify({'error': 'Passwords must be at least 8 characters '})
                else:
                    sql = "update users set password = %s where user_id= %s"
                    cursor = con.cursor()
                    cursor.execute(sql, (hash_password(new1), user_id))
                    con.commit()
                    from functions import send_sms
                    message = "Dear {}. Your password has been changed!".format(row[2])
                    send_sms(row[9], message)
                    return jsonify({'success': 'Password changed'})
        else:
            return render_template('/admin/changepassword.html')
    else:
        redirect('/adminlogin')


if __name__ == '__main__':
    #  debug=True enables it to update itself
    app.run(debug=True)
