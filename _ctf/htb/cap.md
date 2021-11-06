---
title:  "cap"
imgdir: cap
tags: web suid
date: 2021-11-05
ctf_meta:
  designer: InfoSecJack
  designer_url: https://app.hackthebox.com/users/52045
  url: https://app.hackthebox.com/machines/351
  rating: 1
---

# Enumeration

Kicking straight off Jumping straight into it, we kick off a scan with rustscan on the target host with `rustscan -a $targetip -- -A -sC`. (rustscan runs quite a bit faster that nmap for the initial scan and can pipe results into nmap for further enumeration. You can find it [here](https://github.com/RustScan/RustScan)).

{% include post-image name="nmap.png" caption="initial nmap scan" %}

The scan identifies ports 21 (ftp), 22 (ssh) and 80 (http) open. Whilst the scans are completing, we can begin to enumerate the http site. Navigating to the webpage shows what seems to be a Security monitoring page.

{% include post-image name="webpage1.png" caption="Security Dashboard HTTP page" %}

We can kick off a gobuster or dirbuster scan, however it is not required for this CTF. Clicking on the Security Snapshot (5 Second PCAP + Analysis) link takes a few seconds to load before redirecting us to a download link for a pcap. If we perform any actions against the server whilst this is loading, we can see that it's capturing a 5 second packet capture and then making it available for download.

{% include post-image name="webpage2.png" caption="Security Dashboard PCAP" %}

Observing the url we are directed to, we can see that it's http://$targetip/data/$number.

After loading up burpsuite, we set our browser to route through the proxy and then repeat the same step in our browser to capture the request.

{% include post-image name="burp1.png" %}

We'll send this to intruder to enumerate any other files available to download.

{% include post-image name="burp2.png" %}

Within intruder, we set the attack type to Sniper and set our target payload location.

{% include post-image name="burp3.png" %}

We set the payload type to numbers and set the range from 0 to 100 with a step of 1.

{% include post-image name="burp4.png" %}

Once the intruder scan has completed, we can sort the results by the status code of 200 to identify those which have a file available for download

{% include post-image name="burp5.png" %}

# Initial Access

Reviewing the available pcaps to download, most of them do not contain anything of much interest. However, downloading the pcap found at http://$targetip/data/0 and analysing it in Wireshark, gives us something more interesting.

{% include post-image name="wireshark1.png" %}

Within this pcap, we can see some FTP traffic. Following the TCP Stream here, we can see the user nathan's FTP credentials in clear text

{% include post-image name="wireshark2.png" %}

Now that we've gathered these credentials, let's try to log into the ftp service.

{% include post-image name="ftp1.png" %}

Great - that's worked as expected, and we can retrieve the user flag at this stage. However, we do need to establish proper code execution before we can proceed. Luckily - credential reuse is a thing, and we can use these same credentials to sign in via ssh.

{% include post-image name="ssh1.png" %}

# Privilege Escalation

Now that we've got a user shell, we need to get to a bit of privilege escalation. Let's start with some manual enumeration by heading back to where we started and investigate the website root directory.


{% include post-image name="nathan1.png" %}

We can see that nathan is the owner of app.py so let's check it out. Reviewing the code, we find a section of particular interest. This is how the packet capture that we encountered earlier is done.

{% include post-image name="app_py1.png" %}

Let's see what user these commands end up being run as by commenting out the packet capture, and adding in our own command.

{% include post-image name="app_py2.png" %}

Reviewing the beginning of the script, we can identify that this is a flask webapp.

{% include post-image name="app_py3.png" %}

After a bit of googling a trial and error, we find out that we can run this application and make it available to our kali host using `flask run --host=0.0.0.0`. (alternatively, we could use `flask run` and set up an SSH port forward to allow us to access the locally available service).

{% include post-image name="flask1.png" %}

We can now navigate to the replicate site that we've just spun up on port 5000.

{% include post-image name="webpage3.png" %}

Clicking onto the Security Snapshot (5 Second PCAP + Analysis) link should trigger the execution of our modified code.

{% include post-image name="webpage4.png" %}

This time, we're not redirected to a download page, so let's check that our test file has been created.

{% include post-image name="nathan2.png" %}

Great, the code is being run as root, so let's update the payload to get us a reverse shell. Let's generate the payload with msfvenom first.

{% include post-image name="msfshell1.png" %}

We can then serve this directory with a python http server using python3 -m http.server 80 and download this onto Cap and set it as executable.

{% include post-image name="msfshell2.png" %}

We now want to update the app.py script to execute this payload.

{% include post-image name="app_py4.png" %}

Next we'll need to set up a meterpreter handler to be ready to receive the reverse shell connection.

{% include post-image name="msfshell3.png" %}

Let's start up the flask web app again and navigate to the modified link to execute our payload.

{% include post-image name="webpage5.png" %}

After clicking the link, our payload is executed and our meterpreter shell connects.

{% include post-image name="msfshell4.png" %}

And we can obtain our root flag.

{% include post-image name="msfshell5.png" %}

