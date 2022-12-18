/* eslint-disable max-len */
import dotenv from "dotenv";
import mailgun from "mailgun-js";

dotenv.config();
const FRONT_BASE = process.env.FRONT_BASE.trim();

const API_KEY = process.env.MAILGUN_API_KEY.trim();
const SENDER_EMAIL = process.env.SENDER_EMAIL.trim();
const DOMAIN = process.env.DOMAIN.trim();

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

/**
 * This function is responsible for sending a reset password
 * email from a given email to another. It inserts a user id
 * and a token in the href path of the html content of the email
 *
 * @param {string} user User object of the receiver user
 * @param {string} token A crypto token used for verification
 * @returns {boolean} True if the email was sent and false if any error occured
 */

// eslint-disable-next-line max-len
export async function sendResetPasswordEmail(user, token) {
  try {
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: "Read-it Password Reset",
      html: `
			<div class="m_-8376988204030579956body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
			<center>
			<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_-8376988204030579956gwfw">
			<tbody><tr>
			<td style="margin:0;padding:0;width:100%" align="center">
			<table width="600" border="0" cellspacing="0" cellpadding="0" class="m_-8376988204030579956m-shell">
			<tbody><tr>
			<td class="m_-8376988204030579956td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			
			<tbody><tr>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956mpx-16" style="padding-left:32px;padding-right:32px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956mpb-20" style="padding-top:16px;padding-bottom:28px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956mpb-28" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left">
				<a href="${FRONT_BASE}/" target="_blank">
					<img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit">
				</a>
			</td>
			<td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td align="right">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left">
				<img src="${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
			<td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299">
				<a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#7a9299" target="_blank">
					<span style="text-decoration:none;color:#7a9299">u/${user.username}</span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mfz-14 m_-8376988204030579956mlh-16 m_-8376988204030579956mpb-20" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			Hi there,
			<br><br>
			
			Looks like a request was made to <span class="il">reset</span> the <span class="il">password</span> for your ${user.username} <span class="il">Reddit</span> account. No problem! You can <span class="il">reset</span> your <span class="il">password</span> now using the lovely button below.
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mpb-28" align="center" style="padding-bottom:34px">
			<table width="214" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important">
				<a href="${FRONT_BASE}/reset-password/${user.id}/${token}" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank">
					<span style="text-decoration:none;color:#ffffff"><strong><span class="il">Reset</span> <span class="il">Password</span></strong></span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mfz-14 m_-8376988204030579956mlh-16 m_-8376988204030579956mpb-20" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			If you didn't want to <span class="il">reset</span> your <span class="il">password</span>, you can safely ignore this email and carry on as usual. And if you need any more help logging in to your <span class="il">Reddit</span> account, check out our <a href="https://www.reddithelp.com/en/categories/privacy-security/account-security" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf">Account Security FAQs</span></a> or <a href="https://www.reddithelp.com/en/submit-request" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf">contact us</span></a>.
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			
			
			<tr>
			<td class="m_-8376988204030579956mpt-16 m_-8376988204030579956mpt-34" style="padding-top:48px" bgcolor="#f2f5f6">
			<table width="100%" cellspacing="0" cellpadding="0" border="0">
			<tbody>
			<tr>
			<td class="m_-8376988204030579956w-104 m_-8376988204030579956mpb-20" style="font-size:0pt;line-height:0pt;text-align:center;padding-bottom:28px"><a href="${FRONT_BASE}/" target="_blank" alt="" width="115" height="40" border="0" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			<tr>
			<td style="padding-bottom:20px" align="center">
			<table cellspacing="0" cellpadding="0" border="0">
			<tbody>
			<tr>
			<td class="m_-8376988204030579956w-114" style="font-size:0pt;line-height:0pt;text-align:left" valign="top"><a href="https://apps.apple.com/us/app/reddit/id1064216828" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://apps.apple.com/us/app/reddit/id1064216828&amp;source=gmail&amp;ust=1671486524932000&amp;usg=AOvVaw3AphA6twGeJ4Ei13l_pjR_"><img src="https://ci3.googleusercontent.com/proxy/LECwhMZFS7zsvkAGgSy-KFmOiIBWQlC-xrIPw1wOhWgGgQSQiVO30RU9GoxwCBGfzsIS4mjH10YiMkpklZrrScGHBUWjL_PRkpulIE0=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/app_store_8_8.png" alt="" width="124" height="37" border="0" class="CToWUd" data-bit="iit"></a></td>
			<td class="m_-8376988204030579956w-8" style="font-size:0pt;line-height:0pt;text-align:left" width="10"></td>
			<td class="m_-8376988204030579956w-114" style="font-size:0pt;line-height:0pt;text-align:left" valign="top"><a href="https://play.google.com/store/apps/details?id=com.reddit.frontpage" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://play.google.com/store/apps/details?id%3Dcom.reddit.frontpage&amp;source=gmail&amp;ust=1671486524932000&amp;usg=AOvVaw0p0ROTwsd2YfFtLJ5MTWaf"><img src="https://ci6.googleusercontent.com/proxy/Uc8pkryaoD6Czm6F_Q53DFW4z8ZiTW0fKGCBzPWMMi4y-LjuGAwkZJ3AUbDsFW6b06b8BYk01LzdBZgHJxbIj23Qq77lDt7IPQtKVqg0RA=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/google_play_8_8.png" alt="" width="124" height="37" border="0" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			</tbody>
			</table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mpx-12 m_-8376988204030579956mpb-20" style="padding-bottom:20px;padding-left:24px;padding-right:24px">
			<table width="100%" cellspacing="0" cellpadding="0" border="0">
			<tbody>
			<tr>
			<td class="m_-8376988204030579956mfz-12 m_-8376988204030579956mlh-18" style="font-size:16px;line-height:18px;color:#687981;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;text-align:center">
			This email was intended for u/${user.username}. <a style="text-decoration:none;color:#006cbf"><span style="text-decoration:none;color:#006cbf">Unsubscribe</span></a> from  messages, or visit your settings to manage what emails <span class="il">Reddit</span> sends you.
			</td>
			</tr>
			</tbody>
			</table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mfz-12 m_-8376988204030579956mlh-18 m_-8376988204030579956mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;color:#222222;text-align:center;padding-left:24px;padding-right:24px">Faculty Of Engineering Cairo University</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956fluid-img" style="font-size:0pt;line-height:0pt;text-align:left"><img src="https://ci6.googleusercontent.com/proxy/jWfzz4U5cA7v4v6I67-jPvk1tWtaxG7FIdD5c4vPlN6oN2aE19dNtG_LHwjd4gO74oke1BW0gjfMSvccRwYn3BTD8pc0421hpY_NLFBnJw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/footer_logo_8_8.png" alt="" width="600" height="115" border="0" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 552px; top: 713px;"><div id=":98" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" title="Download" role="button" tabindex="0" aria-label="Download attachment " jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB" data-tooltip-class="a1V"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div></td>
			</tr>
			</tbody>
			</table>
			</td>
			</tr>
			
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</center>
			<img alt="" src="https://ci5.googleusercontent.com/proxy/xY03fzVRjQtxkqW0kfKqqpOaNZhARRLJ6hr94em-4JAwqit3kBBM7HtUDwjV-6sM9eYcTxNWOM_gETEOoOtHUjhK3DjShLWYq9OYiVPh_v5vbH79nXFP_FXw-lgKId5ezWAz31JoEBlTzfZWWIG-X0QeYGoAzl1zXPHM7FLjunnfNi9f9GAP8ME7009B8AorUHsX8Nh9uUmNnVjD=s0-d-e1-ft#https://ql9whnmm.r.us-east-1.awstrack.me/I0/010001840b8a690a-a98182e0-166f-4315-84b5-62ea2a5c983e-000000/TU0_xh-U2pIacvQ2-gFKFoD8Hs4=292" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
			</div></div>
					`,
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * This function used to send a verification email to certain user
 * to verify his email after sign up
 *
 * @param {string} user User object of the receiver user
 * @param {string} token Verification token that will be used to verify the email
 * @returns {boolean} True if the email was sent successfully and false if any error occured
 */
export function sendVerifyEmail(user, token) {
  try {
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: "Read-it Verify Email",
      html: `
			<div class="m_4332781606896536018body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
			<center>
			<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_4332781606896536018gwfw">
			<tbody><tr>
			<td style="margin:0;padding:0;width:100%" align="center">
			<table width="600" border="0" cellspacing="0" cellpadding="0" class="m_4332781606896536018m-shell">
			<tbody><tr>
			<td class="m_4332781606896536018td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			
			
			<tbody><tr>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018mpx-16" style="padding-left:32px;padding-right:32px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018mpb-20" style="padding-top:16px;padding-bottom:28px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018mpb-40" style="padding-bottom:54px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td align="right">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
			<td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299"><a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#7a9299" target="_blank"><span style="text-decoration:none;color:#7a9299">u/${user.username}</span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mfz-14 m_4332781606896536018mlh-16" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:34px">
			Hi there,
			<br><br>
			
			Your email address <a style="text-decoration:none;color:#000000"><span style="text-decoration:none;color:#000000">${user.email}</span></a> has been added to your <span style="text-decoration:none;color:#000000">${user.username}</span> <span class="il">Reddit</span> account. But wait, we're not done yet...
			<br><br>
			
			To finish <span class="il">verifying</span> your email address and securing your account, <span style="text-decoration:none;color:#000000">click the button below</span>.
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mpb-28" align="center" style="padding-bottom:40px">
			<table width="214" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important">
				<a href="${FRONT_BASE}/verify-email/${user.id}/${token}" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank"><span style="text-decoration:none;color:#ffffff"><strong><span class="il">Verify</span> Email Address</strong></span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mpb-20" bgcolor="#f1f5f6" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018fluid-img m_4332781606896536018mpb-8" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/jWfzz4U5cA7v4v6I67-jPvk1tWtaxG7FIdD5c4vPlN6oN2aE19dNtG_LHwjd4gO74oke1BW0gjfMSvccRwYn3BTD8pc0421hpY_NLFBnJw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/footer_logo_8_8.png" width="600" height="125" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mpb-20" align="center" style="padding-bottom:40px">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://apps.apple.com/us/app/reddit/id1064216828" target="_blank"><img src="https://ci3.googleusercontent.com/proxy/LECwhMZFS7zsvkAGgSy-KFmOiIBWQlC-xrIPw1wOhWgGgQSQiVO30RU9GoxwCBGfzsIS4mjH10YiMkpklZrrScGHBUWjL_PRkpulIE0=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/app_store_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td class="m_4332781606896536018w-8" width="10" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td class="m_4332781606896536018w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://play.google.com/store/apps/details?id=com.reddit.frontpage" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/Uc8pkryaoD6Czm6F_Q53DFW4z8ZiTW0fKGCBzPWMMi4y-LjuGAwkZJ3AUbDsFW6b06b8BYk01LzdBZgHJxbIj23Qq77lDt7IPQtKVqg0RA=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/google_play_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mfz-12 m_4332781606896536018mlh-18 m_4332781606896536018mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;color:#222222;text-align:center;padding-left:24px;padding-right:24px">Faculty Of Engineering Cairo University</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</center>
			<img alt="" src="https://ci4.googleusercontent.com/proxy/71xIuvtxb0Rrjen1WWQgvRRF5MwJiLBBQYgPyX1DQdL1SYPQxCDxxZEjiPNOAJrH_vs58yIj1iIirEDYsyxMqcqzVzBS6TBjdqUOV7ApnV5uU34dAY3_TllLZECjD-IMKcW-ghdHV_ksSDJxnQmTsGOeTzIgwqnby1skakXdCystH-lIR-CnbpBuisuPJkSLjrHMpjEF4KvZrJZ8=s0-d-e1-ft#https://ql9whnmm.r.us-east-1.awstrack.me/I0/01000183fed3e4df-d85bfb81-0ec3-4785-8a86-4980148c07da-000000/iNypIlqMsVRDnOLzVe3RvzkFdZM=292" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
			</div></div>
        `,
    });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * This function used to send an email with the username
 * of the user who forget his username
 *
 * @param {string} user User object of the receiver user
 * @returns {boolean} True if the email was sent successfully and false if any error occured
 */
export function sendUsernameEmail(user) {
  try {
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: "Read-it Forget Username",
      html: `
			<div class="m_7551772197302646080body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
			<center>
			<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_7551772197302646080gwfw">
			<tbody><tr>
			<td style="margin:0;padding:0;width:100%" align="center">
			<table width="600" border="0" cellspacing="0" cellpadding="0" class="m_7551772197302646080m-shell">
			<tbody><tr>
			<td class="m_7551772197302646080td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080mpx-16" style="padding-left:32px;padding-right:32px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080mpb-20" style="padding-top:16px;padding-bottom:28px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080mpb-28" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td align="right">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
			<td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299"><a href="${FRONT_BASE}/user/${user.username}"><span style="text-decoration:none;color:#7a9299">u/${user.username}</span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mfz-14 m_7551772197302646080mlh-16 m_7551772197302646080mpb-34" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			Hi there,
			<br><br>
			
			You forgot it didn't you? Hey, it happens. Here you go:
			<br><br>
			
			
			Your username is <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf"><span style="color:#006cbf"><strong>${user.username}</strong></span></span></a>
			<br><br>
			
			(Username checks out, nicely done.)
			<br><br>
			
			
			</td></tr><tr>
			<td class="m_7551772197302646080mpb-28" align="center" style="padding-bottom:34px">
			<table width="214" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important"><a href="${FRONT_BASE}/login/" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank"><span style="text-decoration:none;color:#ffffff"><strong>Log In</strong></span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			
			
			<tr>
			<td class="m_7551772197302646080mfz-14 m_7551772197302646080mlh-16 m_7551772197302646080mpb-34" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			
			If you didn't ask to recover your username, you can safely ignore this email and carry on as usual. And if you need any more help logging in to your Reddit account, check out our <a href="https://www.reddithelp.com/en/categories/privacy-security/account-security" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf">contact us</span></a>.
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mpb-20" bgcolor="#f1f5f6" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080fluid-img m_7551772197302646080mpb-8" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/jWfzz4U5cA7v4v6I67-jPvk1tWtaxG7FIdD5c4vPlN6oN2aE19dNtG_LHwjd4gO74oke1BW0gjfMSvccRwYn3BTD8pc0421hpY_NLFBnJw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/footer_logo_8_8.png" width="600" height="125" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mpb-20" align="center" style="padding-bottom:40px">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://apps.apple.com/us/app/reddit/id1064216828" target="_blank"><img src="https://ci3.googleusercontent.com/proxy/LECwhMZFS7zsvkAGgSy-KFmOiIBWQlC-xrIPw1wOhWgGgQSQiVO30RU9GoxwCBGfzsIS4mjH10YiMkpklZrrScGHBUWjL_PRkpulIE0=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/app_store_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td class="m_7551772197302646080w-8" width="10" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td class="m_7551772197302646080w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://play.google.com/store/apps/details?id=com.reddit.frontpage" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/Uc8pkryaoD6Czm6F_Q53DFW4z8ZiTW0fKGCBzPWMMi4y-LjuGAwkZJ3AUbDsFW6b06b8BYk01LzdBZgHJxbIj23Qq77lDt7IPQtKVqg0RA=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/google_play_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mfz-12 m_7551772197302646080mlh-18 m_7551772197302646080mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;color:#222222;text-align:center;padding-left:24px;padding-right:24px">Faculty Of Engineering Cairo University</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</center>
			<img alt="" src="https://ci6.googleusercontent.com/proxy/bwtRB9aWkt1s-aeb5hquj-dYog3VTizFCqxQGWizRsqHihSP_2yl93sR9TU8wn0NH8vNB_BP3xN4ktXaFlzI695Z84d8yxENnBa8d_ihZW4voPyaR5mciyEwFxk2x8Z2Om0Zdrr1BmfmkJLpqMo2oC82IgYOgDc0iZVIIcKQUYS33QM7VbWR8Wt8Hiyy9Fgq3izv2FSq4anV0lbN=s0-d-e1-ft#https://ql9whnmm.r.us-east-1.awstrack.me/I0/01000184482b4f8c-515a98cc-3544-4c3e-a065-532c15144bde-000000/SUI7vSjxt2z0Ct7tFFxXBBkNgc4=294" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
			</div></div>
        `,
    });
    return true;
  } catch (err) {
    return false;
  }
}
